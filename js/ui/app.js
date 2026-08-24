/**
 * NEX ASSOCIATE — Main Standalone UI Application Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const apiClient = new NexAssociateApiClient();
  const orchestra = new NexAssociateOrchestra(NEX_DATA);

  let currentTeacherProfile = {
    curriculum: "NERDC",
    gradeLevel: "SS2",
    paidSubjects: ["MATH", "ENG", "PHY"]
  };

  // Tab Navigation
  const navBtns = document.querySelectorAll(".nav-btn");
  const panes = document.querySelectorAll(".section-pane");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      navBtns.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(`pane-${target}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // 1. TEACHER ONBOARDING & PER-SUBJECT BILLING PORTAL
  function initBillingPortal() {
    const subjectContainer = document.getElementById("tb-subject-checkboxes");
    const summaryCard = document.getElementById("tb-billing-summary-card");
    const telemetryBox = document.getElementById("tb-activation-telemetry");
    const curriculumSelect = document.getElementById("tb-curriculum-select");
    const gradeSelect = document.getElementById("tb-grade-select");
    const activateBtn = document.getElementById("btn-activate-teacher-plan");

    if (!subjectContainer || !summaryCard || typeof NEX_TEACHER_BILLING === "undefined") return;

    // Render subject checkboxes
    subjectContainer.innerHTML = NEX_DATA.subjectCatalog.map(sub => {
      const isChecked = currentTeacherProfile.paidSubjects.includes(sub.code);
      return `
        <label style="display: flex; align-items: center; gap: 0.5rem; color: #E2E8F0; font-size: 0.85rem; cursor: pointer; background: rgba(15, 23, 42, 0.6); padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color);">
          <input type="checkbox" class="tb-subject-check" value="${sub.code}" data-name="${sub.name}" ${isChecked ? "checked" : ""}>
          <span>${sub.icon} ${sub.name}</span>
        </label>
      `;
    }).join("");

    function updateBillingCalculation() {
      const selectedChecks = document.querySelectorAll(".tb-subject-check:checked");
      const subjectCount = selectedChecks.length;
      const calc = NEX_TEACHER_BILLING.calculateBilling(subjectCount, "NGN");

      summaryCard.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--nexus-gold); font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">
          TEACHER SUBSCRIPTION PLAN
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Curriculum Framework:</span>
          <span style="color: var(--nexus-cyan); font-weight: 600;">${curriculumSelect.value}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Active Class Level:</span>
          <span style="color: var(--nexus-orange); font-weight: 600;">${gradeSelect.value}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Active Subjects:</span>
          <span style="color: var(--nexus-emerald); font-weight: 700;">${calc.subjectCount} Subject(s) Selected</span>
        </div>

        <hr style="border: 0; border-top: 1px dashed var(--border-color); margin: 0.8rem 0;">

        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span>Base Rate (${calc.subjectCount} x ₦1,500/mo):</span>
          <span>${calc.formattedSubtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem; color: var(--nexus-emerald);">
          <span>Multi-Subject Volume Discount (${calc.discountPercent}% OFF):</span>
          <span>-${calc.formattedDiscount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.8rem; padding-top: 0.8rem; border-top: 2px solid var(--nexus-gold);">
          <strong style="color: var(--text-main); font-size: 1.1rem;">Total Monthly Charge:</strong>
          <strong style="color: var(--nexus-gold); font-size: 1.3rem;">${calc.formattedTotalMonthly} / month</strong>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.4rem; text-align: right;">
          Effective cost: ${calc.formattedEffectiveRate} per subject / month
        </div>
      `;
    }

    document.querySelectorAll(".tb-subject-check").forEach(chk => {
      chk.addEventListener("change", updateBillingCalculation);
    });
    curriculumSelect.addEventListener("change", updateBillingCalculation);
    gradeSelect.addEventListener("change", updateBillingCalculation);

    if (activateBtn) {
      activateBtn.addEventListener("click", () => {
        const selectedChecks = Array.from(document.querySelectorAll(".tb-subject-check:checked")).map(c => c.value);
        currentTeacherProfile.curriculum = curriculumSelect.value;
        currentTeacherProfile.gradeLevel = gradeSelect.value;
        currentTeacherProfile.paidSubjects = selectedChecks;

        const calc = NEX_TEACHER_BILLING.calculateBilling(selectedChecks.length, "NGN");
        
        telemetryBox.textContent = `[PROFILE ACTIVATED AT ${new Date().toLocaleTimeString()}]
• Curriculum Locked: ${curriculumSelect.value}
• Class Level: ${gradeSelect.value}
• Paid Subject Licenses (${selectedChecks.length}): ${selectedChecks.join(", ")}
• Subscription Status: ACTIVE (${calc.formattedTotalMonthly}/month)
• NEX Associate Gateway linked to NEX Curriculum REST API.`;
      });
    }

    updateBillingCalculation();
  }

  // 2. QUERY & FETCH MATERIALS FROM NEX CURRICULUM
  function initQueryGateway() {
    const btnQuery = document.getElementById("btn-fetch-curriculum");
    const outputBox = document.getElementById("curriculum-fetch-output");
    const subjectSelect = document.getElementById("gateway-subject-select");
    const topicInput = document.getElementById("gateway-topic-input");

    if (!btnQuery) return;

    btnQuery.addEventListener("click", async () => {
      outputBox.textContent = `[GATEWAY QUERY INITIATED] Connecting to NEX Curriculum REST API (POST /v1/kits/lesson)...`;

      const topicRequest = {
        subject: subjectSelect.value,
        topic: topicInput.value || "Curriculum Module",
        week: 4
      };

      const result = await apiClient.queryNexCurriculum(currentTeacherProfile, topicRequest);
      outputBox.textContent = JSON.stringify(result.kit, null, 2);
    });
  }

  // 3. TEACHER FEEDBACK & RELAY PORTAL
  function initFeedbackPortal() {
    const btnSubmit = document.getElementById("btn-submit-feedback");
    const feedbackSubject = document.getElementById("fb-subject-select");
    const feedbackComment = document.getElementById("fb-comment-text");
    const relayBox = document.getElementById("fb-relay-response-box");

    if (!btnSubmit) return;

    btnSubmit.addEventListener("click", async () => {
      relayBox.textContent = `[FORWARDING TO NEX CURRICULUM] Transmitting teacher comment to NEX Insight REST API (POST /v1/feedback/submit)...`;

      const payload = {
        subject: feedbackSubject.value,
        class: currentTeacherProfile.gradeLevel,
        comment: feedbackComment.value || "Requesting additional visual diagrams for classroom delivery."
      };

      const response = await apiClient.forwardTeacherFeedback(payload);

      relayBox.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--nexus-emerald); padding: 1rem; border-radius: 8px; color: var(--text-main);">
          <div style="color: var(--nexus-emerald); font-weight: 700; margin-bottom: 0.4rem;">
            🟢 RESOLUTION RELAYED FROM NEX CURRICULUM (Ticket: ${response.ticket_id})
          </div>
          <p style="font-size: 0.88rem; margin-bottom: 0.5rem;">${response.relayMessageForTeacher}</p>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            <strong>Action Taken by NEX Curriculum:</strong> ${response.actionTaken}<br>
            <strong>Patched Version:</strong> ${response.updatedVersion} • <strong>Timestamp:</strong> ${response.timestamp}
          </div>
        </div>
      `;
    });
  }

  // 4. MULTI-TIER AGENT ORGANOGRAM RENDERER
  function renderOrganogram() {
    const container = document.getElementById("organogram-agent-grid");
    if (!container) return;

    container.innerHTML = NEX_DATA.leadAgents.map(agent => `
      <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid var(--border-color); padding: 1rem; border-radius: 10px; border-left: 3px solid var(--nexus-orange);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <h4 style="color: var(--nexus-white); font-size: 0.95rem;">${agent.name}</h4>
          <span style="font-size: 0.68rem; background: rgba(255, 107, 0, 0.2); color: var(--nexus-orange); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700;">${agent.badge}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.6rem;">${agent.role}</p>
        <div style="font-size: 0.75rem; color: var(--nexus-cyan);">
          <strong>Recruited Tier 3 Micro-Agents (${agent.microAgents.length}):</strong><br>
          ${agent.microAgents.map(m => `<code>${m}</code>`).join(" • ")}
        </div>
      </div>
    `).join("");
  }

  // Initial Seed Operations
  initBillingPortal();
  initQueryGateway();
  initFeedbackPortal();
  renderOrganogram();
});
