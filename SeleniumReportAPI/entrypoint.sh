﻿#!/bin/bash

# Function to check if SQL Server is up and accepting connections.
wait_for_sql() {
    echo "Checking SQL Server connection..."

    while ! /opt/mssql-tools/bin/sqlcmd -S db,1433 -U sa -P P@ssw0rd@123### -Q "SELECT 1" > /dev/null 2>&1; do
        echo "Waiting for SQL Server to be available..."
        sleep 1
    done

    echo "SQL Server is up and accepting connections."
}

# Wait for SQL Server to be ready.
wait_for_sql

# Run migrations
dotnet ef database update

# Execute the SQL script for stored procedures
echo "Executing AllGhostQA_SP.sql against the database..."
/opt/mssql-tools/bin/sqlcmd -S db,1433 -U sa -P P@ssw0rd@123### -i /SeleniumReportAPI/SqlScript/AllGhostQA_SP.sql


# Start the application
dotnet SeleniumReportAPI.dll
