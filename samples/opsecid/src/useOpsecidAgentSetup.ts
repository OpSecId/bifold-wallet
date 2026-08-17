import {
  DispatchAction,
  migrateToAskar,
  TOKENS,
  useServices,
  useStore,
  type WalletSecret,
} from '@bifold/core'
import { Agent, CredoError } from '@credo-ts/core'
import { DidCommHttpOutboundTransport, DidCommWsOutboundTransport } from '@credo-ts/didcomm'
import { agentDependencies } from '@credo-ts/react-native'
import { useCallback, useRef, useState } from 'react'

import { createLinkSecretIfRequired, getOpsecidAgentModules, type OpsecidAgent } from './agent'

export type AgentSetupReturnType = {
  agent: Agent | null
  initializeAgent: (walletSecret: WalletSecret) => Promise<void>
  shutdownAndClearAgentIfExists: () => Promise<void>
}

const useOpsecidAgentSetup = (): AgentSetupReturnType => {
  const [agent, setAgent] = useState<Agent | null>(null)
  const agentInstanceRef = useRef<Agent | null>(null)
  const [store, dispatch] = useStore()
  const [logger, bridge] = useServices([TOKENS.UTIL_LOGGER, TOKENS.UTIL_AGENT_BRIDGE])

  const restartExistingAgent = useCallback(
    async (existingAgent: Agent): Promise<Agent | undefined> => {
      try {
        await existingAgent.initialize()
      } catch (error) {
        logger.warn(`Agent restart failed with error ${error}`)
        return
      }

      return existingAgent
    },
    [logger]
  )

  const createNewAgent = useCallback(
    async (walletSecret: WalletSecret, mediatorUrl: string): Promise<OpsecidAgent> => {
      const newAgent = new Agent({
        config: {
          logger,
          autoUpdateStorageOnStartup: true,
        },
        dependencies: agentDependencies,
        modules: getOpsecidAgentModules({
          walletSecret,
          mediatorInvitationUrl: mediatorUrl,
        }),
      })
      const wsTransport = new DidCommWsOutboundTransport()
      const httpTransport = new DidCommHttpOutboundTransport()

      newAgent.modules.didcomm.registerOutboundTransport(wsTransport)
      newAgent.modules.didcomm.registerOutboundTransport(httpTransport)

      return newAgent
    },
    [logger]
  )

  const migrateIfRequired = useCallback(
    async (newAgent: Agent, walletSecret: WalletSecret) => {
      if (!store.migration.didMigrateToAskar) {
        await migrateToAskar(walletSecret.id, walletSecret.key, newAgent)
        dispatch({
          type: DispatchAction.DID_MIGRATE_TO_ASKAR,
        })
      }
    },
    [store.migration.didMigrateToAskar, dispatch]
  )

  const initializeAgent = useCallback(
    async (walletSecret: WalletSecret): Promise<void> => {
      const mediatorUrl = store.preferences.selectedMediator
      logger.info('Checking for existing agent...')
      if (agentInstanceRef.current) {
        const restartedAgent = await restartExistingAgent(agentInstanceRef.current)
        if (restartedAgent) {
          logger.info('Successfully restarted existing agent...')
          agentInstanceRef.current = restartedAgent
          bridge.setAgent(restartedAgent)
          setAgent(restartedAgent)
          return
        }
      }

      logger.info('Creating OpSecId agent...')
      const newAgent = await createNewAgent(walletSecret, mediatorUrl)

      logger.info('Migrating if required...')
      await migrateIfRequired(newAgent, walletSecret)

      try {
        logger.info('Initializing agent...')
        await newAgent.initialize()
      } catch (e: unknown) {
        const err = e as CredoError
        logger.error('Stack: ' + err.stack)
        logger.error('Message: ' + err.message)
        logger.error(err.cause?.stack ?? 'No cause stack')
        logger.error(err.cause?.message ?? 'No cause message')
        throw e
      }

      logger.info('Creating link secret if required...')
      await createLinkSecretIfRequired(newAgent)

      logger.info('Agent initialized successfully')
      agentInstanceRef.current = newAgent
      setAgent(newAgent)
      bridge.setAgent(newAgent)
    },
    [
      logger,
      restartExistingAgent,
      createNewAgent,
      migrateIfRequired,
      store.preferences.selectedMediator,
      bridge,
    ]
  )

  const shutdownAndClearAgentIfExists = useCallback(async () => {
    if (agent) {
      try {
        await agent.shutdown()
      } catch (error) {
        logger.error(`Error shutting down agent with shutdownAndClearAgentIfExists: ${error}`)
      } finally {
        bridge.clearAgent()
        setAgent(null)
      }
    }
  }, [agent, logger, bridge])

  return { agent, initializeAgent, shutdownAndClearAgentIfExists }
}

export default useOpsecidAgentSetup
