import { useBasicMessages, useCredentialByState, useProofByState } from '@bifold/react-hooks'
import {
  DidCommBasicMessageRecord,
  DidCommCredentialExchangeRecord,
  DidCommCredentialState,
  DidCommProofExchangeRecord,
  DidCommProofState,
} from '@credo-ts/didcomm'
import { ProofCustomMetadata, ProofMetadata } from '@bifold/verifier'
import { useEffect, useMemo, useState } from 'react'
import {
  BasicMessageMetadata,
  CredentialMetadata,
  basicMessageCustomMetadata,
  credentialCustomMetadata,
} from '../../../../packages/core/src/types/metadata'

type DidCommNotification =
  | DidCommBasicMessageRecord
  | DidCommCredentialExchangeRecord
  | DidCommProofExchangeRecord

export const useDidCommNotifications = (_props?: {
  openIDUri?: string
  openIDPresentationUri?: string
}): DidCommNotification[] => {
  const doneStates = useMemo(
    () => [DidCommProofState.Done, DidCommProofState.PresentationReceived] as DidCommProofState[],
    []
  )

  const [notifications, setNotifications] = useState<DidCommNotification[]>([])
  const { records: basicMessages } = useBasicMessages()
  const offers = useCredentialByState(DidCommCredentialState.OfferReceived)
  const proofsRequested = useProofByState(DidCommProofState.RequestReceived)
  const credsReceived = useCredentialByState(DidCommCredentialState.CredentialReceived)
  const credsDone = useCredentialByState(DidCommCredentialState.Done)
  const proofsDone = useProofByState(doneStates)

  useEffect(() => {
    const unseenMessages: DidCommBasicMessageRecord[] = basicMessages.filter((msg) => {
      const meta = msg.metadata.get(BasicMessageMetadata.customMetadata) as basicMessageCustomMetadata
      return !meta?.seen
    })

    const contactsWithUnseenMessages: string[] = []
    const messagesToShow: DidCommBasicMessageRecord[] = []

    unseenMessages.forEach((msg) => {
      if (!contactsWithUnseenMessages.includes(msg.connectionId)) {
        contactsWithUnseenMessages.push(msg.connectionId)
        messagesToShow.push(msg)
      }
    })

    const validProofsDone = proofsDone.filter((proof: DidCommProofExchangeRecord) => {
      if (proof.isVerified === undefined) {
        return false
      }

      const metadata = proof.metadata.get(ProofMetadata.customMetadata) as ProofCustomMetadata
      return !metadata?.details_seen
    })

    const revoked = credsDone.filter((cred: DidCommCredentialExchangeRecord) => {
      const metadata = cred.metadata.get(CredentialMetadata.customMetadata) as credentialCustomMetadata
      return Boolean(cred.revocationNotification && metadata?.revoked_seen === undefined)
    })

    const next = [...messagesToShow, ...offers, ...proofsRequested, ...validProofsDone, ...revoked].sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )

    setNotifications(next)
  }, [basicMessages, credsReceived, proofsDone, proofsRequested, offers, credsDone])

  return notifications
}
