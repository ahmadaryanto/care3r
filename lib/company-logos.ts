/**
 * Locally hosted company icons (public/logos), verified against each company's
 * real domain. Companies not listed here render a monogram.
 */
export const COMPANY_LOGOS: Record<string, { src: string; light?: boolean }> = {
  Bitget: { src: "/logos/bitget.png" },
  Perle: { src: "/logos/perle.png" },
  Crusoe: { src: "/logos/crusoe.png" },
  Kast: { src: "/logos/kast.png" },
  Aave: { src: "/logos/aave.png", light: true },
  "Monad Foundation": { src: "/logos/monad-foundation.png" },
  "Monad Labs": { src: "/logos/monad-labs.png" },
  Alchemy: { src: "/logos/alchemy.png" },
  "1inch": { src: "/logos/1inch.png" },
  Chainstack: { src: "/logos/chainstack.png" },
  "Arbitrum Foundation": { src: "/logos/arbitrum-foundation.png" },
  Tenderly: { src: "/logos/tenderly.png" },
  Nansen: { src: "/logos/nansen.png" },
  Dune: { src: "/logos/dune.png" },
  OpenSea: { src: "/logos/opensea.png" },
  Axiom: { src: "/logos/axiom.png" },
  Polymarket: { src: "/logos/polymarket.png" },
  "Jito Labs": { src: "/logos/jito-labs.png" },
  Crossmint: { src: "/logos/crossmint.png" },
  "CoW DAO": { src: "/logos/cow-dao.png" },
  "Solana Foundation": { src: "/logos/solana-foundation.png" },
  Kuru: { src: "/logos/kuru.png" },
  CoinGecko: { src: "/logos/coingecko.png" },
  Ethena: { src: "/logos/ethena.png" },
  "ether.fi": { src: "/logos/ether-fi.png" },
  "Polygon Labs": { src: "/logos/polygon-labs.png" },
  Alpaca: { src: "/logos/alpaca.png" },
  Nethermind: { src: "/logos/nethermind.png" },
  Chronicle: { src: "/logos/chronicle.png" },
  "Sei Network": { src: "/logos/sei-network.png" },
  Dragonfly: { src: "/logos/dragonfly.png" },
  Remote3: { src: "/logos/remote3.png" },
  Superteam: { src: "/logos/superteam.png" },
  "Anchorage Digital": { src: "/logos/anchorage-digital.png" },
  "Geode Labs": { src: "/logos/geode-labs.png" },
  "Kakao Ventures": { src: "/logos/kakao-ventures.png" },
  Stokr: { src: "/logos/stokr.png" },
  RugsDotFun: { src: "/logos/rugsdotfun.png" },
  "Category Labs": { src: "/logos/category-labs.png" },
};

export function hasCompanyLogo(company: string) {
  return Boolean(COMPANY_LOGOS[company]);
}
