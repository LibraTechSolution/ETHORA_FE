import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';

const TradeView = dynamic(() => import('@/views/TradeView/index').then((mod) => mod.default), {
  ssr: false,
  loading: () => <Loading />,
});

export default function TradingPage() {
  return <TradeView />;
}
