// src/hooks/useRouterData.jsx
import { useLoaderData, useRouteError, useNavigation } from 'react-router-dom';

/**
 * Hook to access router data and loading states
 * Provides easy access to loader data, navigation state, and error handling
 */
const useRouterData = () => {
  const data = useLoaderData();
  const error = useRouteError();
  const navigation = useNavigation();

  return {
    data,
    error,
    isLoading: navigation.state === 'loading',
    isSubmitting: navigation.state === 'submitting',
    navigationState: navigation.state,
    location: navigation.location
  };
};

export default useRouterData;