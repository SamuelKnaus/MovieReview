import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function withRouter(Child: any) {
  return function test(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Child {...props} navigate={navigate} location={location} params={params} />;
  };
}
