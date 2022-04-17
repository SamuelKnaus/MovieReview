import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

/**
 * Enables routing functionality for the given component
 * That way the child has access to the location, the navigate function and the url parameters
 * @param Child The component that needs routing functionality
 * @returns The child as rendered JSX element
 */
export default function withRouter(Child: any) {
  return function getChild(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Child {...props} navigate={navigate} location={location} params={params} />;
  };
}
