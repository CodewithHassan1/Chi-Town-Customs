// Chi-Town Customs USA — Desktop Client Application Logic
(function () {
  let inventoryItems = [];
  let currentScannedItem = null;
  let posCart = [];
  let pendingAdjustItem = null;

  // DOM Elements
  const inventoryTbody = document.getElementById("inventoryTbody");
  const inventorySearch = document.getElementById("inventorySearch");
  const typeFilter = document.getElementById("typeFilter");
  const stockFilter = document.getElementById("stockFilter");
  const backendPill = document.getElementById("backendPill");
  const statusDot = document.getElementById("statusDot");
  const backendStatusText = document.getElementById("backendStatusText");
  const chicagoClock = document.getElementById("chicagoClock");

  // Tab Navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

      item.classList.add("active");
      const tabId = item.getAttribute("data-tab");
      document.getElementById(tabId)?.classList.add("active");

      if (tabId === "tab-scanner") {
        document.getElementById("scanInput")?.focus();
      } else if (tabId === "tab-pickup") {
        loadPickupOrders();
      }
    });
  });

  // Chicago Clock
  function updateClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      chicagoClock.textContent = new Intl.DateTimeFormat("en-US", options).format(now) + " CST";
    } catch {
      chicagoClock.textContent = new Date().toLocaleTimeString();
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Ping Backend
  async function checkBackend() {
    if (!window.desktopApi?.ping) {
      backendStatusText.textContent = "Standalone Mode";
      return;
    }

    const res = await window.desktopApi.ping();
    if (res.online) {
      statusDot.className = "status-dot";
      backendStatusText.textContent = `Online (${res.latencyMs || 0}ms)`;
      document.getElementById("diagStatus").textContent = "ONLINE (200 OK)";
      document.getElementById("diagStatus").style.color = "var(--success)";
      document.getElementById("diagPing").textContent = `${res.latencyMs || 0} ms`;
    } else {
      statusDot.className = "status-dot offline";
      backendStatusText.textContent = "Offline (Local Queue)";
      document.getElementById("diagStatus").textContent = `OFFLINE (${res.error || "Cannot reach server"})`;
      document.getElementById("diagStatus").style.color = "var(--error)";
      document.getElementById("diagPing").textContent = "--";
    }
  }
  setInterval(checkBackend, 5000);
  checkBackend();

  // Sync Inventory
  async function syncInventory() {
    inventoryTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">Syncing live inventory from Chicago shop database...</td></tr>`;

    if (!window.desktopApi?.sync) {
      console.warn("window.desktopApi not found");
      return;
    }

    const data = await window.desktopApi.sync();
    if (data.success && data.items) {
      inventoryItems = data.items;
      renderInventoryTable();
      renderMovementsLedger(data.recentMovements || []);
      document.getElementById("diagLastSync").textContent = new Date().toLocaleTimeString();
    } else {
      inventoryTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--error);">Failed to synchronize: ${data.error || "Unknown server error"}</td></tr>`;
    }
  }

  function renderInventoryTable() {
    const q = (inventorySearch?.value || "").toLowerCase().trim();
    const typeVal = typeFilter?.value || "ALL";
    const stockVal = stockFilter?.value || "ALL";

    const filtered = inventoryItems.filter((item) => {
      const matchQ =
        !q ||
        item.sku.toLowerCase().includes(q) ||
        (item.product?.name || "").toLowerCase().includes(q) ||
        (item.finish || "").toLowerCase().includes(q) ||
        (item.boltPattern || "").toLowerCase().includes(q) ||
        (item.barcode || "").toLowerCase().includes(q);

      const matchType = typeVal === "ALL" || item.product?.productType === typeVal;

      let matchStock = true;
      if (stockVal === "LOW") {
        matchStock = item.stockOnHand <= item.reorderLevel;
      } else if (stockVal === "OUT") {
        matchStock = item.stockOnHand === 0;
      } else if (stockVal === "IN_STOCK") {
        matchStock = item.stockOnHand > 0;
      }

      return matchQ && matchType && matchStock;
    });

    if (filtered.length === 0) {
      inventoryTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">No products match filter criteria.</td></tr>`;
      return;
    }

    inventoryTbody.innerHTML = filtered
      .map((item) => {
        const available = Math.max(0, item.stockOnHand - (item.stockReserved || 0));
        let stockClass = "stock-ok";
        if (item.stockOnHand === 0) stockClass = "stock-zero";
        else if (item.stockOnHand <= item.reorderLevel) stockClass = "stock-low";

        const specs = [
          item.diameter ? `${item.diameter}"` : "",
          item.width ? `${item.width}J` : "",
          item.boltPattern || "",
          item.finish || "",
          item.tireWidth ? `${item.tireWidth}/${item.aspectRatio}R${item.diameter}` : "",
        ]
          .filter(Boolean)
          .join(" &bull; ");

        return `
          <tr>
            <td><span class="sku-badge">${item.sku}</span></td>
            <td>
              <div style="font-weight: 700; color:#fff;">${item.product?.name || "Product"}</div>
              <div style="font-size: 10px; color: var(--text-secondary);">${specs}</div>
            </td>
            <td><span style="font-size:10px; font-weight:700; color:var(--text-secondary);">${item.product?.productType || "ITEM"}</span></td>
            <td style="font-family:'JetBrains Mono'; font-weight:700; color:var(--brand-red);">$${item.price.toFixed(2)}</td>
            <td><span class="stock-badge ${stockClass}">${item.stockOnHand}</span></td>
            <td style="font-family:'JetBrains Mono'; color:var(--text-muted);">${item.stockReserved || 0}</td>
            <td style="font-family:'JetBrains Mono'; font-weight:700; color:#fff;">${available}</td>
            <td>
              <div style="display: flex; gap: 4px;">
                <button class="btn btn-secondary btn-sm" onclick="window.desktopQuickAdjust('${item.id}', 1, 'Quick receipt (+1)')">+1</button>
                <button class="btn btn-secondary btn-sm" onclick="window.desktopQuickAdjust('${item.id}', -1, 'Quick deduction (-1)')">-1</button>
                <button class="btn btn-secondary btn-sm" onclick="window.openAdjustModal('${item.id}')">Edit</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // Stock Adjustment Handlers
  window.desktopQuickAdjust = async function (variantId, delta, reason) {
    if (!window.desktopApi?.adjust) return;
    const res = await window.desktopApi.adjust({
      variantId,
      quantityDelta: delta,
      reason,
      staffName: "Lead Tech (Desktop Client)",
    });

    if (res.success) {
      await syncInventory();
    } else {
      alert("Adjustment failed: " + (res.error || "Unknown error"));
    }
  };

  window.openAdjustModal = function (variantId) {
    const item = inventoryItems.find((i) => i.id === variantId);
    if (!item) return;

    pendingAdjustItem = item;
    document.getElementById("adjustModalTitle").textContent = `Adjust SKU: ${item.sku}`;
    document.getElementById("adjustModalSubtitle").textContent = `${item.product?.name} (Current On Hand: ${item.stockOnHand})`;
    document.getElementById("adjustQtyInput").value = "1";
    document.getElementById("adjustReasonInput").value = "";
    document.getElementById("adjustModal").classList.add("active");
  };

  document.getElementById("btnCancelAdjust")?.addEventListener("click", () => {
    document.getElementById("adjustModal")?.classList.remove("active");
    pendingAdjustItem = null;
  });

  document.getElementById("btnConfirmAdjust")?.addEventListener("click", async () => {
    if (!pendingAdjustItem) return;

    const qty = parseInt(document.getElementById("adjustQtyInput").value, 10);
    const reason = document.getElementById("adjustReasonInput").value.trim();

    if (isNaN(qty) || qty === 0) {
      alert("Please enter a valid non-zero quantity delta.");
      return;
    }
    if (!reason) {
      alert("Please enter a reason for the audit ledger.");
      return;
    }

    await window.desktopQuickAdjust(pendingAdjustItem.id, qty, reason);
    document.getElementById("adjustModal")?.classList.remove("active");
    pendingAdjustItem = null;
  });

  // Filter Listeners
  inventorySearch?.addEventListener("input", renderInventoryTable);
  typeFilter?.addEventListener("change", renderInventoryTable);
  stockFilter?.addEventListener("change", renderInventoryTable);
  document.getElementById("btnRefreshInventory")?.addEventListener("click", syncInventory);

  // CSV Export
  document.getElementById("btnExportCsv")?.addEventListener("click", () => {
    if (inventoryItems.length === 0) return;
    const headers = ["SKU", "Barcode", "Product", "Type", "Finish", "BoltPattern", "Price", "StockOnHand", "StockReserved"];
    const rows = inventoryItems.map((i) => [
      i.sku,
      i.barcode || "",
      `"${(i.product?.name || "").replace(/"/g, '""')}"`,
      i.product?.productType || "",
      i.finish || "",
      i.boltPattern || "",
      i.price,
      i.stockOnHand,
      i.stockReserved || 0,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `chitown_customs_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // --- Barcode Scanner Station ---
  const scanInput = document.getElementById("scanInput");
  const scanCardContent = document.getElementById("scanCardContent");

  async function handleScan(query) {
    if (!query) return;
    scanCardContent.innerHTML = `<div style="padding: 30px; text-align: center; color: var(--text-secondary);">Querying database for '${query}'...</div>`;

    if (!window.desktopApi?.lookup) return;
    const res = await window.desktopApi.lookup(query);

    if (res.success && res.item) {
      currentScannedItem = res.item;
      renderScannedCard(res.item);
    } else {
      currentScannedItem = null;
      scanCardContent.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--error);">
          <strong>Item Not Found</strong>
          <p style="font-size: 11px; color: var(--text-secondary); margin-top: 6px;">No catalog item matches barcode/SKU '${query}'.</p>
        </div>
      `;
    }
  }

  function renderScannedCard(item) {
    const specs = [
      item.diameter ? `${item.diameter}"` : "",
      item.width ? `${item.width}J` : "",
      item.boltPattern || "",
      item.finish || "",
      item.tireWidth ? `${item.tireWidth}/${item.aspectRatio}R${item.diameter}` : "",
    ]
      .filter(Boolean)
      .join(" &bull; ");

    scanCardContent.innerHTML = `
      <div class="card-preview">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="sku-badge" style="font-size: 14px; color: var(--brand-red);">${item.sku}</span>
            <h4 style="font-size: 16px; font-weight: 800; color: #fff; margin-top: 4px;">${item.product?.name || "Product"}</h4>
            <p style="font-size: 11px; color: var(--text-secondary);">${specs}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-secondary);">Retail Price</div>
            <div style="font-size: 18px; font-weight: 900; color: #fff; font-family: 'JetBrains Mono';">$${item.price.toFixed(2)}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 10px 0;">
          <div style="background: #111317; border: 1px solid var(--border-default); border-radius: 6px; padding: 10px; text-align: center;">
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-secondary);">On Hand</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--success); font-family: 'JetBrains Mono';">${item.stockOnHand}</div>
          </div>
          <div style="background: #111317; border: 1px solid var(--border-default); border-radius: 6px; padding: 10px; text-align: center;">
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-secondary);">Reserved</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--warning); font-family: 'JetBrains Mono';">${item.stockReserved || 0}</div>
          </div>
          <div style="background: #111317; border: 1px solid var(--border-default); border-radius: 6px; padding: 10px; text-align: center;">
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-secondary);">Available</div>
            <div style="font-size: 18px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono';">${Math.max(0, item.stockOnHand - (item.stockReserved || 0))}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary);">Quick Scanner Operations</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button class="btn btn-secondary" onclick="window.desktopQuickAdjust('${item.id}', 1, 'Scanned Single Unit Receipt (+1)')">+1 Receive Single</button>
            <button class="btn btn-secondary" onclick="window.desktopQuickAdjust('${item.id}', 4, 'Scanned Full 4-Wheel Set Receipt (+4)')">+4 Receive Set</button>
            <button class="btn btn-secondary" style="color: var(--error);" onclick="window.desktopQuickAdjust('${item.id}', -1, 'Damaged / Scratched in Shop Floor (-1)')">-1 Damage Write-off</button>
            <button class="btn btn-secondary" onclick="window.desktopQuickAdjust('${item.id}', -4, 'Counter Mount &amp; Balance (-4)')">-4 In-Store Mount</button>
          </div>
        </div>
      </div>
    `;
  }

  scanInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleScan(scanInput.value.trim());
      scanInput.value = "";
    }
  });

  document.getElementById("btnTestScanWheel")?.addEventListener("click", () => {
    handleScan("CT-APX7-2095-5114-GB");
  });
  document.getElementById("btnTestScanTire")?.addEventListener("click", () => {
    handleScan("MICH-PS4S-255-35-20");
  });

  // --- In-Store POS & Sales Ticket ---
  const posTbody = document.getElementById("posTbody");
  const posProductSearch = document.getElementById("posProductSearch");
  const posSubtotal = document.getElementById("posSubtotal");
  const posTax = document.getElementById("posTax");
  const posTotal = document.getElementById("posTotal");

  document.getElementById("btnPosAdd")?.addEventListener("click", () => {
    const q = (posProductSearch?.value || "").toLowerCase().trim();
    if (!q) return;

    const found = inventoryItems.find(
      (i) => i.sku.toLowerCase().includes(q) || (i.product?.name || "").toLowerCase().includes(q)
    );

    if (!found) {
      alert("Product not found. Try searching by exact SKU.");
      return;
    }

    const existing = posCart.find((c) => c.id === found.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      posCart.push({ ...found, quantity: 1 });
    }

    posProductSearch.value = "";
    renderPosCart();
  });

  function renderPosCart() {
    if (posCart.length === 0) {
      posTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Ticket empty. Search and add products above.</td></tr>`;
      posSubtotal.textContent = "$0.00";
      posTax.textContent = "$0.00";
      posTotal.textContent = "$0.00";
      return;
    }

    let subtotal = 0;
    posTbody.innerHTML = posCart
      .map((item, index) => {
        const lineTotal = item.price * item.quantity;
        subtotal += lineTotal;
        return `
          <tr>
            <td style="font-weight: 700; color: #fff;">${item.product?.name || "Product"}</td>
            <td><span class="sku-badge">${item.sku}</span></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 4px;">
                <button class="btn btn-secondary btn-sm" onclick="window.posChangeQty(${index}, -1)">-</button>
                <span style="font-family:'JetBrains Mono'; font-weight:700; min-width: 20px; text-align: center;">${item.quantity}</span>
                <button class="btn btn-secondary btn-sm" onclick="window.posChangeQty(${index}, 1)">+</button>
              </div>
            </td>
            <td style="font-family: 'JetBrains Mono'; font-weight: 800; color: var(--brand-red);">$${lineTotal.toFixed(2)}</td>
            <td><button class="btn btn-secondary btn-sm" onclick="window.posRemove(${index})">&times;</button></td>
          </tr>
        `;
      })
      .join("");

    const tax = subtotal * 0.1025; // 10.25% Chicago Cook County Sales Tax
    const total = subtotal + tax;

    posSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    posTax.textContent = `$${tax.toFixed(2)}`;
    posTotal.textContent = `$${total.toFixed(2)}`;
  }

  window.posChangeQty = function (index, delta) {
    if (!posCart[index]) return;
    posCart[index].quantity += delta;
    if (posCart[index].quantity <= 0) posCart.splice(index, 1);
    renderPosCart();
  };

  window.posRemove = function (index) {
    posCart.splice(index, 1);
    renderPosCart();
  };

  document.getElementById("btnClearTicket")?.addEventListener("click", () => {
    posCart = [];
    renderPosCart();
  });

  // Record Sale and Deduct Authoritative Stock
  document.getElementById("btnRecordSale")?.addEventListener("click", async () => {
    if (posCart.length === 0) {
      alert("Ticket is empty.");
      return;
    }

    const customerName = document.getElementById("posCustomerName")?.value || "Walk-In Customer";
    const vehicle = document.getElementById("posVehicle")?.value || "";

    // Deduct each item from authoritative inventory
    for (const item of posCart) {
      await window.desktopQuickAdjust(
        item.id,
        -item.quantity,
        `POS In-Store Sale for ${customerName} (${vehicle || "Counter Walk-in"})`
      );
    }

    alert(`Sale recorded successfully! Inventory balances deducted from authoritative database.`);
    posCart = [];
    renderPosCart();
  });

  // Print Receipt
  document.getElementById("btnPrintReceipt")?.addEventListener("click", () => {
    if (posCart.length === 0) {
      alert("Ticket is empty.");
      return;
    }

    const customerName = document.getElementById("posCustomerName")?.value || "Walk-in Customer";
    const customerPhone = document.getElementById("posCustomerPhone")?.value || "N/A";
    const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1025;
    const total = subtotal + tax;

    const receiptHtml = `
      <div style="font-family: monospace; max-width: 320px; margin: 0 auto; line-height: 1.4;">
        <center>
          <strong style="font-size: 16px;">CHI-TOWN CUSTOMS USA</strong><br>
          311 N Cicero Ave, Chicago, IL 60644<br>
          Tel: +1 773-287-3000<br>
          ---------------------------------------<br>
          IN-SHOP SALES RECEIPT<br>
          ${new Date().toLocaleString()}<br>
          ---------------------------------------
        </center>
        Customer: ${customerName}<br>
        Phone: ${customerPhone}<br>
        =======================================<br>
        ${posCart
          .map(
            (i) =>
              `${i.sku} x${i.quantity}<br>&nbsp;&nbsp;${i.product?.name || "Item"}<br>&nbsp;&nbsp;$${(
                i.price * i.quantity
              ).toFixed(2)}<br>`
          )
          .join("")}
        ---------------------------------------<br>
        Subtotal: $${subtotal.toFixed(2)}<br>
        Chicago Tax (10.25%): $${tax.toFixed(2)}<br>
        <strong>TOTAL PAID: $${total.toFixed(2)}</strong><br>
        =======================================<br>
        <center>
          Thank you for trusting Chi-Town Customs!<br>
          100% Fitment Guarantee &bull; 4.5 Stars
        </center>
      </div>
    `;

    const printArea = document.getElementById("printArea");
    if (printArea) {
      printArea.innerHTML = receiptHtml;
      printArea.style.display = "block";
      if (window.desktopApi?.print) {
        window.desktopApi.print();
      } else {
        window.print();
      }
      setTimeout(() => {
        printArea.style.display = "none";
      }, 1000);
    }
  });

  // --- Pickup Fulfillment Desk ---
  const pickupTbody = document.getElementById("pickupTbody");

  async function loadPickupOrders() {
    pickupTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">Fetching store pickup orders...</td></tr>`;

    if (!window.desktopApi?.orders) return;
    const res = await window.desktopApi.orders({ status: "ALL" });

    if (res.success && res.orders) {
      // Filter for pickup orders or display all orders with fulfillment status
      const pickupOrders = res.orders;

      if (pickupOrders.length === 0) {
        pickupTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">No customer orders found.</td></tr>`;
        return;
      }

      pickupTbody.innerHTML = pickupOrders
        .map((ord) => {
          return `
            <tr>
              <td><span class="sku-badge">${ord.orderNumber}</span></td>
              <td style="font-weight: 700; color: #fff;">${ord.guestName || ord.user?.name || "Customer"}</td>
              <td style="font-size: 10px; color: var(--text-secondary);">${ord.guestPhone || ord.guestEmail || ord.user?.email || "N/A"}</td>
              <td style="font-family: 'JetBrains Mono'; font-weight: 800; color: var(--brand-red);">$${ord.totalAmount.toFixed(2)}</td>
              <td><span style="font-size: 10px; font-weight: 700; color: #fff;">${ord.fulfillmentType}</span></td>
              <td>
                <span class="stock-badge ${ord.status === "DELIVERED" ? "stock-ok" : ord.status === "READY_FOR_PICKUP" ? "stock-low" : "stock-zero"}">
                  ${ord.status}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 4px;">
                  ${ord.status !== "READY_FOR_PICKUP" && ord.status !== "DELIVERED" ? `<button class="btn btn-secondary btn-sm" onclick="window.updateOrderStatus('${ord.id}', 'READY_FOR_PICKUP')">Ready for Pickup</button>` : ""}
                  ${ord.status !== "DELIVERED" ? `<button class="btn btn-red btn-sm" onclick="window.updateOrderStatus('${ord.id}', 'DELIVERED')">Mark Picked Up</button>` : `<span style="font-size: 10px; color: var(--success); font-weight: 700;">Completed</span>`}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }
  }

  window.updateOrderStatus = async function (orderId, newStatus) {
    if (!window.desktopApi?.updateOrder) return;
    const res = await window.desktopApi.updateOrder({
      orderId,
      status: newStatus,
      notes: `Updated to ${newStatus} from Shop Operations Desktop Terminal`,
    });
    if (res.success) {
      loadPickupOrders();
    } else {
      alert("Failed to update order: " + (res.error || "Unknown error"));
    }
  };

  document.getElementById("btnRefreshOrders")?.addEventListener("click", loadPickupOrders);

  // --- Diagnostics Movements Ledger ---
  function renderMovementsLedger(movements) {
    const container = document.getElementById("diagMovementsList");
    if (!container) return;

    if (movements.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted);">No stock movements recorded yet.</div>`;
      return;
    }

    container.innerHTML = movements
      .map((m) => {
        const isPos = m.quantityDelta > 0;
        return `
          <div style="background: #08090B; border: 1px solid var(--border-default); border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="sku-badge" style="color: #fff;">${m.variant?.sku || "SKU"}</span>
              <span style="font-size: 10px; color: var(--text-secondary); margin-left: 6px;">${m.reason || m.movementType}</span>
            </div>
            <div style="font-family: 'JetBrains Mono'; font-weight: 800; color: ${isPos ? "var(--success)" : "var(--error)"};">
              ${isPos ? "+" : ""}${m.quantityDelta} &rarr; Bal: ${m.balanceAfter}
            </div>
          </div>
        `;
      })
      .join("");
  }

  document.getElementById("btnForceFullSync")?.addEventListener("click", () => {
    checkBackend();
    syncInventory();
  });

  // Initial Sync on Boot
  syncInventory();
})();
