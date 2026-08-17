import { Screens, type Config, type OnboardingTask, type State } from '@bifold/core'
import type { Agent } from '@credo-ts/core'

const complete = (name: Screens): OnboardingTask => ({ name, completed: true })

export const generateOpsecidOnboardingSteps = (
  state: State,
  _config: Config,
  _termsVersion: number,
  agent: Agent | null
): OnboardingTask[] => {
  const { didCreatePIN, didConsiderBiometry, didCompleteTutorial, didAgreeToTerms } = state.onboarding
  const { servedPenalty } = state.loginAttempt
  const { didAuthenticate } = state.authentication

  return [
    complete(Screens.Preface),
    complete(Screens.UpdateAvailable),
    { name: Screens.Onboarding, completed: didCompleteTutorial },
    { name: Screens.Terms, completed: Number(didAgreeToTerms) === _termsVersion },
    { name: Screens.CreatePIN, completed: didCreatePIN },
    { name: Screens.Biometry, completed: didConsiderBiometry },
    complete(Screens.PushNotifications),
    complete(Screens.NameWallet),
    { name: Screens.AttemptLockout, completed: servedPenalty !== false },
    { name: Screens.EnterPIN, completed: didAuthenticate || !didCreatePIN },
    { name: Screens.Splash, completed: !!agent },
  ]
}
