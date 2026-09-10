import assert from 'node:assert/strict';
import test from 'node:test';
import { ApprovalRequiredError, ExecutionAdapterUnavailableError } from '../src/runtime/execution-errors';

test('execution errors expose stable machine codes', () => {
  assert.equal(new ApprovalRequiredError().code, 'approval_required');
  assert.equal(new ExecutionAdapterUnavailableError().code, 'execution_adapter_unavailable');
});
