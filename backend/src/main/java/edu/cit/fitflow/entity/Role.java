package edu.cit.fitflow.entity;

/**
 * Enum representing the different roles within the system.
 * Each role has specific permissions and responsibilities.
 */
public enum Role {
    USER, // Can follow workout plans and track personal progress
    ADMIN, // Can manage users and oversee system-wide activities
    TRAINER // Can manage workout programs and monitor client progress
}
