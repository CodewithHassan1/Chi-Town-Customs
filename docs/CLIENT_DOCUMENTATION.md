# Chi-Town Customs USA — Client & Store Operations User Guide

**Platform Version:** 1.0 (Storefront & Operations CMS)  
**Facility Location:** 311 N Cicero Ave, Chicago, IL 60644  
**Primary Contact:** +1 773-287-3000 | info@chitowncustoms.com  
**Website:** [https://chi-town-customs.vercel.app](https://chi-town-customs.vercel.app)

---

## 1. Platform Overview

Welcome to **Chi-Town Customs USA**, Chicago's dedicated digital platform for custom forged wheels, performance tires, rim repair, and automotive styling.

This platform provides two cohesive experiences:
1. **The Customer Storefront**: An engaging, high-end online shop where vehicle owners can verify exact wheel and tire fitment, explore custom finishes, request repair quotes, and pre-qualify for flexible financing.
2. **The Staff Operations Hub**: A secure, centralized back-office dashboard where shop management and technicians oversee real-time inventory, process customer orders, manage repair inquiries, and update website content.

---

## 2. Customer Experience & Common Workflows

### A. Finding Guaranteed-Fit Wheels & Tires
Customers never need to guess whether a wheel will clear their brake calipers or fit their bolt pattern:
1. **Enter Vehicle Specs**: On the homepage or the dedicated **Vehicle Fitment Finder**, choose the vehicle **Year**, **Make**, **Model**, and **Trim**.
2. **Instant Matching**: The system immediately filters the catalog to show only wheels and tires guaranteed to fit with zero fender rub and correct clearance.
3. **Explore Finishes**: Customers can browse finishes such as Gloss Piano Black, Brushed Titanium, Satin Bronze, and Candy Apple Red.
4. **Select Fitment Packages**: Add wheels, tires, or a complete mounted and balanced package to the shopping cart.

---

### B. Requesting Wheel Repair & Powder Coating Quotes
For vehicle owners dealing with bent rims, curb rash, or cracked aluminum wheels:
1. Navigate to **Services** in the top navigation bar.
2. Choose from our core services:
   * **Hydraulic CNC Rim Straightening**: Restores bent rims to factory runout tolerances.
   * **TIG Crack Welding**: Structural repair using aerospace-grade aluminum welding.
   * **Custom Powder Coating**: Multi-layer electrostatic coating cured in high-temperature ovens.
   * **Hunter Road Force Elite Balancing**: Eliminates highway vibration and uneven tire wear.
3. Click **Get Free Quote** to submit vehicle details, photos of wheel damage, and preferred appointment dates.
4. A notification appears instantly in the staff operations hub for technician review.

---

### C. Applying for 0% Down Financing
Customers can upgrade their wheels and tires immediately without paying everything upfront:
1. Visit the **Financing** page from the main navigation.
2. Select from our trusted finance partners: **Snap Finance**, **Acima Leasing**, or **Affirm**.
3. Complete the secure 2-minute pre-qualification form (no impact on credit scores).
4. Approved customers receive an instant spending limit and can take advantage of convenient **100-Day Cash Payoff** promotions.

---

### D. Checkout & Order Fulfillment Options
Customers have complete flexibility during checkout:
* **Local Shop Pickup**: Pick up completed orders directly at our facility (311 N Cicero Ave, Chicago). Includes optional professional in-shop mounting and balancing.
* **Nationwide Freight Shipping**: Insured freight delivery with full tracking right to the customer's home or preferred installer.

---

## 3. Staff Operations Hub (`/admin`)

The Staff Hub is the command center for shop management. It is private and accessible only to authorized personnel.

### A. Accessing the Staff Portal
1. Open any modern web browser.
2. In the URL address bar, type:
   ```
   https://chi-town-customs.vercel.app/admin
   ```
3. The platform will automatically direct you to the secure **Staff Sign In** portal.
4. Enter your authorized staff email address and password, then click **Sign In To Admin**.

> **Note:** To maintain security, there are no public links to the admin portal on the customer-facing website. Simply enter `/admin` in the browser bar.

---

### B. Daily Operations Dashboard
Upon signing in, you are greeted by the **Operations Dashboard**:
* **Live Revenue & Order Volume**: Track daily, weekly, and monthly sales performance.
* **Open Repair & Quote Requests**: See new customer inquiries requiring pricing estimates or scheduling follow-ups.
* **Low Inventory Alerts**: Quickly spot popular tire sizes or custom wheel variants that have dropped below minimum stock levels.
* **Recent Inventory Activity**: View the latest stock adjustments, shipments received, and reserved customer sets.

---

### C. Managing Inventory (Stock Ledger)
1. In the left navigation menu, click **Inventory Ledger**.
2. **Reviewing Stock**: See exact counts for `On Hand` (physical shop stock) and `Reserved` (already purchased by customers awaiting pickup).
3. **Receiving Shipments**: When a freight shipment of wheels or tires arrives from suppliers (e.g. Michelin, Continental), click **Receive Stock**, select the item, enter the quantity, and input the Purchase Order number.
4. **Manual Adjustments**: If an item is damaged on the shop floor or used for an in-house warranty replacement, log an adjustment with a brief note so shop records remain 100% accurate.

---

### D. Fulfilling Customer Orders
1. In the left menu, select **Orders & Fulfillment**.
2. Click on any customer order to inspect purchase details, customer contact information, and requested fulfillment method (Local Pickup vs. Shipping).
3. **Updating Order Progress**:
   * Change status to **Processing** when technicians begin mounting and balancing wheels.
   * Change status to **Ready for Pickup** when the set is prepped in the front lobby. The customer automatically receives an email notification.
   * For freight orders, enter the carrier (e.g., FedEx Freight, UPS) and tracking number, then mark as **Shipped**.

---

### E. Handling Quotes & Service Inquiries
1. Click **Quotes & Inquiries** in the left menu.
2. Review incoming requests for rim repair, powder coating, or financing assistance.
3. Open an inquiry to read the customer's vehicle model and description of wheel damage.
4. Assign the request to a specific technician, add internal pricing notes, and update the status to **Contacted** or **Scheduled** once you have spoken with the customer.

---

### F. Updating Website Content (CMS Site Customizer)
Management can easily update storefront promotions without contacting developers:
1. Click **CMS Site Customizer** in the left menu.
2. Adjust promotional announcements (e.g., *"Fall Wheel & Tire Special: 10% Off Powder Coating"*).
3. Update featured shop services, warranty terms, or frequently asked questions.
4. Click **Save Changes** to instantly reflect updates on the live website.

---

### G. Signing Out
At the end of your shift:
1. Look at the bottom of the left sidebar.
2. Click **Sign Out**.
3. The platform will terminate your active session and return you to the login screen, ensuring your system remains secure.

---

## 4. System Requirements

### Recommended Web Browsers
The Chi-Town Customs platform is fully responsive and optimized for modern web browsers:
* **Desktop**: Google Chrome (v110+), Apple Safari (v16+), Microsoft Edge (v110+), Mozilla Firefox (v115+).
* **Mobile & Tablets**: Safari on iOS 16+, Chrome on Android 12+.

### Shop Floor Hardware (Optional POS)
* **Screen Resolution**: Best experienced on displays of 1280x720 or higher.
* **Barcode Scanners**: Any standard USB or Bluetooth HID barcode scanner can be used to scan wheel and tire SKU barcodes directly into the search fields.

---

## 5. Frequently Asked Questions & Troubleshooting

### Q1: I am trying to open the Admin Portal, but it redirects me to a login page. Is this normal?
**Answer:** Yes. For security purposes, all management pages require an active staff login. Enter your staff credentials on the login screen to access the portal.

### Q2: What should I do if an employee forgets their staff password?
**Answer:** The Super Admin can reset staff credentials directly in the **System Settings** section of the Staff Hub, or an administrator can re-assign passwords using secure shop protocols.

### Q3: A customer's rare or custom vehicle doesn't appear in the Fitment Finder. How can we help them?
**Answer:** Direct the customer to click **Custom Fitment Inquiry** on the fitment page, or advise them to call the shop at **+1 773-287-3000**. Master technicians can take manual measurements of bolt patterns, hub bore, and brake caliper overhang to build a custom fitment package.

### Q4: How quickly does customer stock update when an order is placed?
**Answer:** Instantly. As soon as an order is completed, the system automatically marks the items as *Reserved*, preventing double-selling.

### Q5: How do we update our shop hours for holidays?
**Answer:** Navigate to **CMS Site Customizer** in the Staff Hub, edit the **Shop Information & Hours** section, and click save. The change appears on the public storefront immediately.

---

## 6. Support Contacts

For operational or technical inquiries, contact the platform management team:
* **Facility Address**: 311 N Cicero Ave, Chicago, IL 60644
* **Shop Phone**: +1 773-287-3000
* **Customer Support Email**: support@chitowncustoms.com
* **Emergency Technical Support**: admin@chitowncustoms.com
