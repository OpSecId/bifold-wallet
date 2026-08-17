const notAvailable = async () => {
  throw new Error('App attestation is not available in OpSecId Wallet')
}

module.exports = {
  attestKeyAsync: notAvailable,
  generateKeyAsync: notAvailable,
  generateHardwareAttestedKeyAsync: notAvailable,
  getAttestationCertificateChainAsync: notAvailable,
  isSupported: false,
  isHardwareAttestationSupportedAsync: async () => false,
}
