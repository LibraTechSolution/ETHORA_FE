import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';

const LeaderboardView = dynamic(() => import('@/views/LeaderboardView').then((mod) => mod.default), {
  ssr: false,
  loading: () => <Loading />,
});

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
