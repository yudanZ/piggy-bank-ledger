import { signalStoreFeature, withState } from '@ngrx/signals';

export type LoadingState = {
  loading: boolean;
};

const initialLoadingState: LoadingState = {
  loading: false,
}

export function  withLoadingState() {
  return signalStoreFeature (
    withState(initialLoadingState),
  );
}


export function setLoading() {
  return {loading: true};
}

