package com.sagar.hr.payroll.service.export;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankExportService {

    public String exportNabilFormat(List<BankExportRow> rows) {
        StringBuilder sb = new StringBuilder();
        sb.append("EMPLOYEE_CODE,EMPLOYEE_NAME,ACCOUNT_NUMBER,AMOUNT,REMARKS\n");
        for (BankExportRow row : rows) {
            sb.append(String.format("%s,%s,%s,%.2f,%s\n",
                    escapeCsv(row.employeeCode()),
                    escapeCsv(row.employeeName()),
                    escapeCsv(row.accountNumber()),
                    row.amount(),
                    escapeCsv(row.remarks())));
        }
        return sb.toString();
    }

    public String exportGlobalIMEBankFormat(List<BankExportRow> rows) {
        StringBuilder sb = new StringBuilder();
        sb.append("TransactionCode,EmployeeName,AccountNumber,Amount,Narration\n");
        int txnCode = 1;
        for (BankExportRow row : rows) {
            sb.append(String.format("TXN%06d,%s,%s,%.2f,%s\n",
                    txnCode++,
                    escapeCsv(row.employeeName()),
                    escapeCsv(row.accountNumber()),
                    row.amount(),
                    escapeCsv(row.remarks())));
        }
        return sb.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    public record BankExportRow(
            String employeeCode,
            String employeeName,
            String accountNumber,
            BigDecimal amount,
            String remarks
    ) {}
}
