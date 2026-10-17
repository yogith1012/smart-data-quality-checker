const API_URL = "http://localhost:8080/api/customers";
const QUALITY_API_URL = "http://localhost:8080/api/quality-summary";

let allCustomers = [];


// 1. Load customer data from Spring Boot.
async function loadCustomers() {
    const customerTable = document.getElementById("customerTable");
    const tableNote = document.getElementById("tableNote");
    const refreshBtn = document.getElementById("refreshBtn");

    try {
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = "Loading...";
        }

        tableNote.textContent = "Loading customer records...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch customer records.");
        }

        const data = await response.json();

        allCustomers = data.map(function(customer) {
            return {
                id: customer.customerId,
                name: customer.customerName ?? "",
                email: customer.email ?? "",
                phone: customer.phone ?? "",
                city: customer.city ?? ""
            };
        });

        displayCustomers();

        // Load the quality summary calculated by Java.
        await loadQualitySummary(false);

    } catch (error) {
        console.error("Customer loading error:", error);

        customerTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Could not load customer data.
                    Check that Spring Boot is running.
                </td>
            </tr>
        `;

        tableNote.textContent = "Unable to load customer records.";

    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = "↻ Refresh Data";
        }
    }
}


// 2. Load the quality summary from Spring Boot.
async function loadQualitySummary(showAlert = false) {
    try {
        const response = await fetch(QUALITY_API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch quality summary.");
        }

        const summary = await response.json();

        // Update summary cards.
        document.getElementById("totalRecords").textContent =
            summary.totalRecords;

        document.getElementById("duplicateGroups").textContent =
            summary.duplicateGroups;

        document.getElementById("missingRecords").textContent =
            summary.missingRecords;

        document.getElementById("invalidEmails").textContent =
            summary.invalidEmails;

        // Update quality overview.
        document.getElementById("duplicateOverview").textContent =
            summary.duplicateGroups;

        document.getElementById("missingOverview").textContent =
            summary.missingRecords;

        document.getElementById("emailOverview").textContent =
            summary.invalidEmails;

        document.getElementById("phoneOverview").textContent =
            summary.invalidPhones;

        const statusBadge = document.querySelector(".status-badge");

        if (statusBadge) {
            statusBadge.textContent = "Quality Check Completed";
        }

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

        return summary;

    } catch (error) {
        console.error("Quality summary error:", error);

        if (showAlert) {
            alert(
                "Could not load the quality summary.\n" +
                "Please check that Spring Boot is running."
            );
        }

        return null;
    }
}


// 3. Check whether a field is missing.
function isMissing(value) {
    return value === null ||
        value === undefined ||
        String(value).trim() === "" ||
        String(value).trim() === "—";
}


// 4. Check email format.
function isInvalidEmail(email) {
    return !isMissing(email) &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


// 5. Check phone number format.
function isInvalidPhone(phone) {
    return !isMissing(phone) &&
        !/^[0-9]{10}$/.test(phone.trim());
}


// 6. Find duplicate customer records.
function getDuplicateKeys() {
    const counts = {};

    allCustomers.forEach(function(customer) {
        const key = [
            customer.name,
            customer.email,
            customer.phone,
            customer.city
        ].map(function(value) {
            return String(value ?? "").trim().toLowerCase();
        }).join("|");

        counts[key] = (counts[key] || 0) + 1;
    });

    return new Set(
        Object.keys(counts).filter(function(key) {
            return counts[key] > 1;
        })
    );
}


// 7. Get the status of a customer.
function getCustomerStatus(customer, duplicateKeys) {
    const key = [
        customer.name,
        customer.email,
        customer.phone,
        customer.city
    ].map(function(value) {
        return String(value ?? "").trim().toLowerCase();
    }).join("|");

    const missing = [
        customer.name,
        customer.email,
        customer.phone,
        customer.city
    ].some(isMissing);

    const invalid =
        isInvalidEmail(customer.email) ||
        isInvalidPhone(customer.phone);

    if (duplicateKeys.has(key)) {
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


// 8. Display customer records in the HTML table.
function displayCustomers() {
    const customerTable = document.getElementById("customerTable");
    const searchInput = document.getElementById("searchInput");

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
            return String(value ?? "").toLowerCase().includes(searchText);
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

    document.getElementById("tableNote").textContent =
        "Showing " + filteredCustomers.length +
        " of " + allCustomers.length + " customer records.";
}


// 9. Run the quality check using the Java backend.
async function runQualityCheck(showAlert = true) {
    await loadQualitySummary(showAlert);
}


// 10. Download customer records and their quality status as CSV.
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

    // Escape special characters for valid CSV cells.
    function escapeCSV(value) {
        let text = String(value ?? "");

        // Prevent spreadsheet formula execution for untrusted text.
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

    // Add a BOM to improve UTF-8 compatibility with spreadsheet apps.
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


// 11. Search customer records.
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        displayCustomers();
    });
}


// 12. Load live data when the page opens.
loadCustomers();