Smart Data Quality Checker

Project Overview

The Smart Data Quality Checker is a DBMS mini project developed using MySQL. It identifies common data-quality problems in customer records using SQL queries and generates a summary report of the detected issues.

Objectives

- Detect duplicate customer records.
- Identify missing values in important fields.
- Find email addresses with invalid basic formats.
- Validate phone numbers using a 10-digit rule.
- Generate a summary report of data-quality issues.

Technologies Used

- Database: MySQL
- Database Tool: MySQL Workbench
- Query Language: SQL
- Version Control: Git and GitHub

Database Structure

The project uses a "customers" table with the following columns:

Column| Description
customer_id| Unique customer identifier
customer_name| Customer name
email| Customer email address
phone| Customer phone number
city| Customer city

Data Quality Checks

1. Duplicate record detection
2. Missing value detection
3. Invalid email format detection
4. Invalid phone number detection
5. Combined data quality summary report

Project Files

- "sample_data.sql" — Creates the database and customer table and inserts sample records.
- "data_quality_checks.sql" — Contains SQL queries for checking data quality and generating the report.

How to Run

1. Install MySQL Server and MySQL Workbench.
2. Open MySQL Workbench and connect to your MySQL server.
3. Open and execute "sample_data.sql" to create the database and load the sample records.
4. Open and execute "data_quality_checks.sql" to run the checks and view the report.

Note: Run the sample-data script only once for the initial setup, or reset the sample table before inserting the records again.

Expected Results

The supplied sample data contains:

- One group of duplicate customer records.
- Three customer records with missing values.
- One invalid email format.
- Zero invalid non-missing phone numbers under the project's 10-digit rule.

Future Enhancements

- Add more validation rules.
- Store detected issues in a dedicated database table.
- Calculate an overall data-quality score.
- Develop a web dashboard to display results.

Author

Developed as a DBMS mini project by an AI & Data Science student.