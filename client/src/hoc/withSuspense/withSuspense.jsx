import React from 'react';
import Loader from '../../components/Loader/Loader';

export function withSuspense(WrappedComponent) {
  return (props) => {
    return (
      <React.Suspense fallback={Loader}>
        <WrappedComponent {...props} />
      </React.Suspense>
    );
  };
}
