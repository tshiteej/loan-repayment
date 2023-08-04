const userTypes = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
};

const loanStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID",
};

const repayStatus = {
  APPROVAL_PENDING: "APPROVAL_PENDING",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  PAID: "PAID",
};

const userStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
};

module.exports = {
  userTypes,
  loanStatus,
  repayStatus,
  userStatus,
};
