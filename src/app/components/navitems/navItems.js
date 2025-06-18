const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        iconClass: "fi fi-rr-home",
    },
    {
        label: "Customer Dashboard",
        iconClass: "fi fi-rr-smart-home",
        children: [
            {
                label: "Summary of Properties",
                href: "/customer_dashboard/property_summary",
                iconClass: "fi fi-ts-land-location",
            },
            {
                label: "Visit Status Overview",
                href: "/customer_dashboard/visit_status_overview",
                iconClass: "fi fi-tr-overview",
            },
            {
                label: "Alert Notification",
                href: "/customer_dashboard/alert_notification",
                iconClass: "fi fi-rs-bell",
            },
        ],
    },
    {
        label: "Customer Properties",
        iconClass: "fi fi-rs-apartment",
        children: [
            {
                label: "Property Overview",
                href: "/customer_properties/property_overview",
                iconClass: "fi fi-ts-land-location",
            },
            {
                label: "Property Documents",
                href: "/customer_properties/property_documents",
                iconClass: "fi fi-rr-document",
            },
            {
                label: "Visit Reports",
                href: "/customer_properties/visit_reports",
                iconClass: "fi fi-ss-newspaper",
            },
            {
                label: "Schedule & Plans",
                href: "/customer_properties/schedule_plans",
                iconClass: "fi fi-tr-calendar-lines-pen",
            },
            {
                label: "Alerts & Complaints",
                href: "/customer_properties/alerts_complaints",
                iconClass: "ffi fi-sr-sensor-alert",
            },
            {
                label: "Additional Services",
                href: "/customer_properties/additional_services",
                iconClass: "fi fi-rs-time-twenty-four",
            },
        ],
    },
    {
        label: "Customer Onboard",
        href: "/customer_onboard",
        iconClass: "fi fi-ss-member-list",
    },
    {
        label: "Customer Information",
        iconClass: "fi fi-sr-file-user",
        children: [
            {
                label: "Customer Info",
                href: "/customer/customer_info", // ✅ must be present and correct
                iconClass: "fi fi-rr-user",
            },
            {
                label: "Onboard Property",
                href: "/customer/property_info", // ✅ must be present and correct
                iconClass: "fi fi-rr-user",
            },
            {
                label: "Document Verification Status",
                href: "/customer/document_verification",
                iconClass: "fi fi-ss-document",
            },
            {
                label: "Schedule Visit ",
                href: "/customer/visit_schedule",
                iconClass: "fi fi-rr-calendar",
            },
        ],
    },
    {
        label: "Field Executive Onboard",
        href: "/field_executive_onboard",
        iconClass: "fi fi-rr-journey",
    },
    {
        label: "Field Executive Information",
        href: "/field_executive_info",
        iconClass: "fi fi-ts-clipboard-user",
    },
    {
        label: "Property Onboard",
        href: "/property_onboard",
        iconClass: "fi fi-ts-land-location",
    },
    {
        label: "Assigned Properties",
        href: "/assigned_properties",
        iconClass: "fi fi-ts-selection",
    },
    {
        label: "Document Verification",
        href: "/document_verification",
        iconClass: "fi fi-tr-file-signature",
    },
    {
        label: "Visit Tracking",
        href: "/visit_tracking",
        iconClass: "fi fi-bs-track",
    },
    {
        label: "Report",
        href: "/report",
        iconClass: "fi fi-rr-newspaper",
    },
    {
        label: "Access Management",
        iconClass: "fi fi-rr-lock-alt",
        children: [
            {
                label: "User Management",
                href: "/access_management/users",
                iconClass: "fi fi-rr-users-alt",
            },
            {
                label: "Role Management",
                href: "/access_management/roles",
                iconClass: "fi fi-rr-id-badge",
            },
            {
                label: "Page Permissions",
                href: "/access_management/page_permissions",
                iconClass: "fi fi-rr-lock",
            },
        ],
    },
    {
        label: "Profile Setting",
        href: "/profile",
        iconClass: "fi fi-rr-user-gear",
    },
];
export default navItems;
