package com.smartdataquality.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class QualityController {

    private final CustomerRepository customerRepository;

    public QualityController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("/quality-summary")
    public Map<String, Object> getQualitySummary() {

        List<Customer> customers = customerRepository.findAll();

        int totalRecords = customers.size();
        int missingRecords = 0;
        int invalidEmails = 0;
        int invalidPhones = 0;

        Map<String, Integer> duplicateCounts = new HashMap<>();

        for (Customer customer : customers) {

            String name = customer.getCustomerName();
            String email = customer.getEmail();
            String phone = customer.getPhone();
            String city = customer.getCity();

            // Count records containing at least one missing field.
            if (isMissing(name) || isMissing(email)
                    || isMissing(phone) || isMissing(city)) {
                missingRecords++;
            }

            // Validate email format.
            if (!isMissing(email)
                    && !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                invalidEmails++;
            }

            // Validate phone format.
            if (!isMissing(phone)
                    && !phone.matches("[0-9]{10}")) {
                invalidPhones++;
            }

            // Identify duplicate combinations.
            String key = normalize(name) + "|"
                    + normalize(email) + "|"
                    + normalize(phone) + "|"
                    + normalize(city);

            duplicateCounts.put(
                    key, duplicateCounts.getOrDefault(key, 0) + 1
            );
        }

        long duplicateGroups = duplicateCounts.values().stream()
                .filter(count -> count > 1)
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRecords", totalRecords);
        summary.put("duplicateGroups", duplicateGroups);
        summary.put("missingRecords", missingRecords);
        summary.put("invalidEmails", invalidEmails);
        summary.put("invalidPhones", invalidPhones);

        return summary;
    }

    private boolean isMissing(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}