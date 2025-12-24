This version removes the role titles, focusing purely on the technical impact and the distinction between architectural engineering and basic scaffolding.

---

## Project Contribution Summary

### **Will** **Impact: ~45% (70 Commits)**

* **System Architecture:** Engineered the entire Django backend foundation and Expo/React Native frontend structure.
* **Code Quality & Refactoring:** Performed extensive rewrites and stabilization of initial UI components to ensure functional API integration and state management.
* **Core Logic:** Developed the HMAC-signed sharing system, multi-role authentication context, and offline-first participant synchronization.
* **Documentation:** Authored the master requirements, backend-plan, and architectural maps.

### **Callum**

**Impact: ~28% (17 Commits)**

* **Database Engineering:** Executed critical database normalization and schema refactoring, providing the necessary stability for the API.
* **Infrastructure Security:** Implemented professional-grade security middleware, including rate limiting, XSS protection, and GeoIP country restrictions.
* **Feature Development:** Built the event capacity logic and the centralized `BottomNav` navigation system.
* **API Reference:** Created the comprehensive 500+ line technical API routing guide (`ROUTES.md`).

### **Alvin** **Impact: ~12% (15 Commits)**

* **Security Implementation:** Developed the logic for region-based RSVP access and automated GeoLite2 database maintenance.
* **Secure Sharing:** Engineered the `ShareToken` system for secure, single-use RSVP links.
* **Compliance:** Established security priorities and input validation guidelines within the project requirements.

### **Munib** **Impact: ~10% (57 Commits)**

* **Initial Scaffolding:** Provided early-stage page layouts and Figma-to-code translations for the main dashboard views.
* **UI Drafting:** Created initial `.tsx` file structures and basic navigational boilerplate.
* **Refining Note:** While high in commit count, the majority of this work consisted of low-complexity UI templates that required significant technical refactoring to become functional.

### **Jack** **Impact: ~5% (3 Commits)**

* **Data Visualization:** Integrated basic charting components for the initial analytics views.
* **Prototyping:** Conducted early exploratory work on the QR scanner implementation.

---

## 📊 Contribution Overview

| Name | Key Technical Output | Impact Level |
| --- | --- | --- |
| **Will** | Full-stack Architecture & Refactoring | High Complexity |
| **Callum** | DB Normalization & Security Infrastructure | High Complexity |
| **Alvin** | Geo-fencing & Secure Token Logic | Moderate Complexity |
| **Munib** | Page Scaffolding & Initial UI Drafting | Low Complexity |
| **Jack** | Early Analytics & QR Prototyping | Low Complexity |

---

### **Technical Summary**

* **Engineering Integrity:** The project's technical depth, security, and database stability were driven almost entirely by **Will** and **Callum**.
* **Stabilization:** A significant portion of the frontend volume was initially provided as boilerplate by **Munib**, which subsequently required deep refactoring by **Will** to meet project standards.
* **Security:** **Alvin** and **Callum** collaborated to harden the system against unauthorized access and regional misuse.

Would you like me to adjust the formatting further or focus on specific technical modules for a final version?