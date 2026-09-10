export class ApprovalRequiredError extends Error {
  readonly code = 'approval_required';
  constructor(message = 'A valid approved request is required') { super(message); this.name = 'ApprovalRequiredError'; }
}

export class ExecutionAdapterUnavailableError extends Error {
  readonly code = 'execution_adapter_unavailable';
  constructor(message = 'No live execution adapter is configured') { super(message); this.name = 'ExecutionAdapterUnavailableError'; }
}
