/*
 * Smart Data Quality Checker
 * Free GitHub Pages demonstration version
 * Uses sample data; no backend required.
 */

let allCustomers = [
    { id: 1, name: "Arun", email: "arun@gmail.com", phone: "9876543210", city: "Erode" },
    { id: 2, name: "Priya", email: "", phone: "9876543211", city: "Salem" },
    { id: 3, name: "Arun", email: "arun@gmail.com", phone: "9876543210", city: "Erode" },
    { id: 4, name: "Ravi", email: "ravi123", phone: "", city: "Coimbatore" },
    { id: 5, name: "Meena", email: "meena@gmail.com", phone: "9876543214", city: "" },
    { id: 6, name: "Yogi", email: "yogith3553@gmail.com", phone: "9360137605", city: "Trichy" },
    { id: 7, name: "Divya", email: "divya@gmail.com", phone: "9876543216", city: "Salem" }
];


// 1. Check whether a value is missing.
function isMissing(value) {
    return value === null ||
        value === undefined ||
        String(value).trim() === "" ||
        String(value).trim() === "—";
}


// 2. Check email format.
function isInvalidEmail(email) {
    return !isMissing(email) &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


// 3. Check phone number format.
function isInvalidPhone(phone) {
    return !isMissing(phone) &&
        !/^[0-9]{10}$/.test(phone.trim());
}


// 4. Create a key to identify duplicate records.
function getCustomerKey(customer) {
    return [
        customer.name,
        customer.email,
        customer.phone,
        customer.city
    ].map(function(value) {
        return String(value ?? "").trim().toLowerCase();
    }).join("|");
}


// 5. Find duplicate customer records.
function getDuplicateKeys() {
    const counts = {};

    allCustomers.forEach(function(customer) {
        const key = getCustomerKey(customer);
        counts[key] = (counts[key] || 0) + 1;
    });

    return new Set(
        Object.keys(counts).filter(function(key) {
            return counts[key] > 1;
        })
    );
}


// 6. Calculate quality summary from sample data.
function calculateQualitySummary() {
    const duplicateKeys = getDuplicateKeys();

    return {
        totalRecords: allCustomers.length,

        // Number of distinct duplicate groups.
        duplicateGroups: duplicateKeys.size,

        // Number of records with at least one missing field.
        missingRecords: allCustomers.filter(function(customer) {
            return [
                customer.name,
                customer.email,
                customer.phone,
                customer.city
            ].some(isMissing);
        }).length,

        invalidEmails: allCustomers.filter(function(customer) {
            return isInvalidEmail(customer.email);
        }).length,

        invalidPhones: allCustomers.filter(function(customer) {
            return isInvalidPhone(customer.phone);
        }).length
    };
}


// 7. Get the quality status of one customer.
function getCustomerStatus(customer, duplicateKeys) {
    const missing = [
        customer.name,
        customer.email,
        customer.phone,
        customer.city
    ].some(isMissing);

    const invalid =
        isInvalidEmail(customer.email) ||
        isInvalidPhone(customer.phone);

    if (duplicateKeys.has(getCustomerKey(customer))) {
        return {
            label: "Duplicate",
            className: "duplicate"
        };
    }

    if (missing) {
        return {
            label: "Missing Data",
            className: "missing"
        };
    }

    if (invalid) {
        return {
            label: "Invalid Data",
            className: "invalid"
        };
    }

    return {
        label: "Valid",
        className: "valid"
    };
}


// 8. Update dashboard summary cards.
function displayQualitySummary(summary) {
    const fields = {
        totalRecords: summary.totalRecords,
        duplicateGroups: summary.duplicateGroups,
        missingRecords: summary.missingRecords,
        invalidEmails: summary.invalidEmails,
        duplicateOverview: summary.duplicateGroups,
        missingOverview: summary.missingRecords,
        emailOverview: summary.invalidEmails,
        phoneOverview: summary.invalidPhones
    };

    Object.entries(fields).forEach(function(entry) {
        const element = document.getElementById(entry[0]);

        if (element) {
            element.textContent = entry[1];
        }
    });

    const badge = document.querySelector(".status-badge");

    if (badge) {
        badge.textContent = "Quality Check Completed";
    }
}


// 9. Display customer records in the table.
function displayCustomers() {
    const customerTable = document.getElementById("customerTable");
    const searchInput = document.getElementById("searchInput");

    if (!customerTable) return;

    const duplicateKeys = getDuplicateKeys();

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    customerTable.innerHTML = "";

    const filteredCustomers = allCustomers.filter(function(customer) {
        return [
            customer.id,
            customer.name,
            customer.email,
            customer.phone,
            customer.city
        ].some(function(value) {
            return String(value ?? "")
                .toLowerCase()
                .includes(searchText);
        });
    });

    filteredCustomers.forEach(function(customer) {
        const row = document.createElement("tr");

        const values = [
            customer.id,
            isMissing(customer.name) ? "—" : customer.name,
            isMissing(customer.email) ? "—" : customer.email,
            isMissing(customer.phone) ? "—" : customer.phone,
            isMissing(customer.city) ? "—" : customer.city
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const status = getCustomerStatus(customer, duplicateKeys);

        const statusCell = document.createElement("td");
        const statusTag = document.createElement("span");

        statusTag.className = "tag " + status.className;
        statusTag.textContent = status.label;

        statusCell.appendChild(statusTag);
        row.appendChild(statusCell);

        customerTable.appendChild(row);
    });

    const tableNote = document.getElementById("tableNote");

    if (tableNote) {
        tableNote.textContent =
            "Showing " + filteredCustomers.length +
            " of " + allCustomers.length + " sample customer records.";
    }
}


// 10. Load the local sample data into the dashboard.
function loadCustomers() {
    const refreshBtn = document.getElementById("refreshBtn");

    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "Loading...";
    }

    allCustomers = allCustomers.slice();

    displayCustomers();
    displayQualitySummary(calculateQualitySummary());

    if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = "↻ Refresh Data";
    }
}


// 11. Run quality checks.
function runQualityCheck(showAlert = true) {
    const summary = calculateQualitySummary();

    displayQualitySummary(summary);
    displayCustomers();

    if (showAlert) {
        alert(
            "Quality Check Completed!\n\n" +
            "Total Records: " + summary.totalRecords + "\n" +
            "Duplicate Groups: " + summary.duplicateGroups + "\n" +
            "Records with Missing Values: " + summary.missingRecords + "\n" +
            "Invalid Emails: " + summary.invalidEmails + "\n" +
            "Invalid Phone Numbers: " + summary.invalidPhones
        );
    }
}


// 12. Download a CSV quality report.
function downloadQualityReport() {
    if (allCustomers.length === 0) {
        alert("No customer records available to export.");
        return;
    }

    const duplicateKeys = getDuplicateKeys();

    const headers = [
        "Customer ID",
        "Customer Name",
        "Email",
        "Phone",
        "City",
        "Quality Status"
    ];

    const rows = allCustomers.map(function(customer) {
        const status = getCustomerStatus(customer, duplicateKeys);

        return [
            customer.id,
            customer.name,
            customer.email,
            customer.phone,
            customer.city,
            status.label
        ];
    });

    function escapeCSV(value) {
        let text = String(value ?? "");

        if (/^[\s]*[=+\-@]/.test(text)) {
            text = "'" + text;
        }

        return '"' + text.replace(/"/g, '""') + '"';
    }

    const csvContent = [headers, ...rows]
        .map(function(row) {
            return row.map(escapeCSV).join(",");
        })
        .join("\r\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "data_quality_report.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    alert("CSV quality report downloaded successfully!");
}


// 13. Connect the search box.
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", displayCustomers);
}


// 14. Load sample data when the page opens.
loadCustomers();