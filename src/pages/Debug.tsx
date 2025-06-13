import { useEffect } from 'react';

const DebugTokenPage = () => {
  useEffect(() => {
    console.log('[DEBUG] Hash:', window.location.hash);
  }, []);

  return (
    <div className="p-4">
      <h1>Debug Token Page</h1>
      <p>URL Hash:</p>
      <code>{window.location.hash}</code>
    </div>
  );
};

export default DebugTokenPage;