import {
  AnonCredsDidCommCredentialFormatService,
  AnonCredsDidCommProofFormatService,
  AnonCredsModule,
  DataIntegrityDidCommCredentialFormatService,
} from '@credo-ts/anoncreds'
import { AskarKeyManagementService, AskarModule } from '@credo-ts/askar'
import { Agent, DidsModule, JwkDidResolver, KeyDidResolver, Kms, PeerDidResolver, WebDidResolver } from '@credo-ts/core'
import {
  DidCommAutoAcceptCredential,
  DidCommAutoAcceptProof,
  DidCommCredentialV2Protocol,
  DidCommDifPresentationExchangeProofFormatService,
  DidCommMediatorPickupStrategy,
  DidCommModule,
  DidCommProofV2Protocol,
} from '@credo-ts/didcomm'
import { SecureEnvironmentKeyManagementService } from '@credo-ts/react-native'
import { WebVhAnonCredsRegistry, WebVhDidResolver } from '@credo-ts/webvh'
import { WorkflowModule } from '@ajna-inc/workflow'
import { anoncreds } from '@hyperledger/anoncreds-react-native'
import { askar } from '@openwallet-foundation/askar-react-native'

import type { WalletSecret } from '@bifold/core'

interface GetOpsecidAgentModulesOptions {
  walletSecret: WalletSecret
  mediatorInvitationUrl?: string
}

export function getOpsecidAgentModules({ walletSecret, mediatorInvitationUrl }: GetOpsecidAgentModulesOptions) {
  return {
    askar: new AskarModule({
      enableKms: false,
      askar,
      store: { id: walletSecret.id, key: walletSecret.key },
    }),
    kms: new Kms.KeyManagementModule({
      backends: [
        new AskarKeyManagementService(),
        new SecureEnvironmentKeyManagementService({ biometricsBacked: false }),
      ],
      defaultBackend: 'askar',
    }),
    anoncreds: new AnonCredsModule({
      anoncreds,
      registries: [new WebVhAnonCredsRegistry()],
    }),
    didcomm: new DidCommModule({
      useDidSovPrefixWhereAllowed: true,
      connections: {
        autoAcceptConnections: true,
      },
      credentials: {
        autoAcceptCredentials: DidCommAutoAcceptCredential.ContentApproved,
        credentialProtocols: [
          new DidCommCredentialV2Protocol({
            credentialFormats: [
              new AnonCredsDidCommCredentialFormatService(),
              new DataIntegrityDidCommCredentialFormatService(),
            ],
          }),
        ],
      },
      proofs: {
        autoAcceptProofs: DidCommAutoAcceptProof.ContentApproved,
        proofProtocols: [
          new DidCommProofV2Protocol({
            proofFormats: [
              new AnonCredsDidCommProofFormatService(),
              new DidCommDifPresentationExchangeProofFormatService(),
            ],
          }),
        ],
      },
      mediationRecipient: {
        mediatorInvitationUrl: mediatorInvitationUrl,
        mediatorPickupStrategy: DidCommMediatorPickupStrategy.Implicit,
      },
    }),
    workflow: new WorkflowModule({
      enableProblemReport: true,
      enablePaymentsEventMapping: false,
      enablePoeEventMapping: false,
      enableAutoDiscoverOnStart: true,
      discoveryTimeoutMs: 30000,
    }),
    dids: new DidsModule({
      resolvers: [
        new WebVhDidResolver(),
        new WebDidResolver(),
        new JwkDidResolver(),
        new KeyDidResolver(),
        new PeerDidResolver(),
      ],
    }),
  }
}

export type OpsecidAgent = Agent<ReturnType<typeof getOpsecidAgentModules>>

export const createLinkSecretIfRequired = async (agent: OpsecidAgent) => {
  const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds()
  if (linkSecretIds.length === 0) {
    await agent.modules.anoncreds.createLinkSecret({
      setAsDefault: true,
    })
  }
}
