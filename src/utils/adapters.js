

export const formatDate = (value) => {
  if (!value) return "-"; 
  const d = new Date(value);
  if (isNaN(d)) return "-"; 
  return d.toLocaleDateString("en-GB"); 
};

export const adaptProjects = (raw = []) => {
  return raw.map((p, idx) => {
    
    const end = p.ProjectEndDate ? new Date(p.ProjectEndDate) : null;
    const today = new Date();
    const daysLeft = end ? Math.ceil((end - today) / (1000 * 60 * 60 * 24)) : null;

    return {
      id: p.Id || idx,
      name: p.ProjectName || "Unnamed Project",
      endDate: end ? end.toLocaleDateString("en-GB") : "-", 
      status: p.CompletionStatus || "Unknown",
      daysLeft,
    };
  });
};



export const adaptEntries = (entries = []) =>
  entries.map((e, idx) => {
    //  WorkDate safe parse
    const date =
      e.WorkDate && !isNaN(Date.parse(e.WorkDate))
        ? new Date(e.WorkDate).toLocaleDateString("en-GB")
        : "—";

    // Employee Name
    const employee =
      e.EmployeeName && e.EmployeeName.trim() !== ""
        ? e.EmployeeName
        : "Unknown";

    // Project Name
    const project =
      e.ProjectName && e.ProjectName.trim() !== ""
        ? e.ProjectName
        : "Unknown";

    //  Title
    const title = e.WorkTitle || "—";

    // Hours
    const hours = e.TotalTimeSpent || "0h";

    return {
      id: e.TimeSheetId || idx,
      date,
      employee,
      project,
      title,
      hours,
      status: e.ManagerApproval || "Pending",
    };
  });



export const adaptSummary = (raw) => {
  if (!raw) {
    return {
      byProject: [],
      approved: 0,
      pending: 0,
      rejected: 0,
      byStatus: [],  
    };
  }

  const approved = raw.approved || 0;
  const pending = raw.pending || 0;
  const rejected = raw.rejected || 0;

  return {
    byProject: raw.byProject?.map(p => ({
      projectName: p.projectName || "Unknown",
      hours: p.hours || 0,
    })) || [],

    approved,
    pending,
    rejected,

    byStatus: [
      { name: "Approved", value: approved },
      { name: "Pending", value: pending },
      { name: "Rejected", value: rejected },
    ], 
  };
};

