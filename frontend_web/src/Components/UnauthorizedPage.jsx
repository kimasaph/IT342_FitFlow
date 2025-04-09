import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
                <p className="text-gray-700 mt-4">You do not have permission to access this page.</p>
                <Link to="/login" className="text-blue-600 hover:underline mt-6 block">
                    Go back to Login
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
