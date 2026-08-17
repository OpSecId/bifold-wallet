// WorkflowModule dynamically requires these optional plugins. They are not
// part of this wallet; the empty stubs keep Metro from treating the lookup
// as a fatal "unknown module" after agent start (right after biometrics).
require('@credo-ts/payments')
require('@credo-ts/payments/workflow/PaymentsV1Actions')
require('@credo-ts/payments/events/PaymentEvents')
require('@ajna-inc/payments')
require('@ajna-inc/payments/workflow/PaymentsV1Actions')
require('@ajna-inc/poe')
require('@ajna-inc/poe/workflow/PoeV1Actions')
