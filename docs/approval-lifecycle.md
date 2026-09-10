# Approval lifecycle

Privileged operations follow a strict lifecycle:

`request → pending → operator approval → approved → execution → executed/failed`

Pending requests have a finite TTL. Expired requests cannot be executed. Certificate renewal execution additionally requires the action `certificate.renew` and a live execution adapter.

The control plane records request and execution outcomes in the audit store. No endpoint should silently execute a privileged operation merely because a request was created.
