package com.sagar.hr.util.calendar;

public record BSDate(int year, int month, int day) {

    public static BSDate of(int year, int month, int day) {
        return new BSDate(year, month, day);
    }

    public String toISOString() {
        return String.format("%04d-%02d-%02d", year, month, day);
    }

    public static BSDate fromISOString(String date) {
        String[] parts = date.split("-");
        return new BSDate(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
    }
}
