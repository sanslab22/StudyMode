import { Suspense } from 'react';
import Notes from '../../../components/Notes';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Notes />
    </Suspense>
  );
}
