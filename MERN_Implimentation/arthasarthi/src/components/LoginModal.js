import { Component } from 'react';

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pin: '',
            isLoading: false,
            error: ''
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value, error: '' });
    }

    handleLogin = (e) => {
        e.preventDefault();
        const { phone, pin } = this.state;

        // Basic validation
        if (!phone.trim() || !pin.trim()) {
            this.setState({ error: 'Please fill in all fields' });
            return;
        }

        if (pin.length !== 4) {
            this.setState({ error: 'PIN must be 4 digits' });
            return;
        }

        // Simulate loading
        this.setState({ isLoading: true });

        setTimeout(() => {
            // Simulate successful login
            this.setState({ 
                isLoading: false,
                phone: '',
                pin: '',
                error: ''
            });
            
            // Call parent callback
            if (this.props.onLogin) {
                this.props.onLogin({ phone, pin });
            }
            
            // Close modal
            if (this.props.onClose) {
                this.props.onClose();
            }
        }, 1000);
    }

    render() {
        const { open, onClose } = this.props;
        const { phone, pin, isLoading, error } = this.state;

        if (!open) return null;

        return (
            <div className="modal fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                <div className="bg-white p-8 rounded-3xl w-96 text-center transform relative shadow-2xl border border-slate-100">
                    <button 
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" 
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                    </button>

                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                        <i className="fas fa-user-lock"></i>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 text-sm mb-6">Login to access your financial dashboard.</p>

                    <form onSubmit={this.handleLogin} className="space-y-3">
                        <input 
                            type="text" 
                            name="phone"
                            placeholder="Phone Number / Aadhaar" 
                            value={phone}
                            onChange={this.handleInputChange}
                            disabled={isLoading}
                            className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition text-sm font-medium disabled:opacity-50"
                        />
                        <input 
                            type="password" 
                            name="pin"
                            placeholder="4-Digit PIN" 
                            value={pin}
                            onChange={this.handleInputChange}
                            maxLength="4"
                            disabled={isLoading}
                            className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition text-sm font-medium disabled:opacity-50"
                        />
                        
                        {error && (
                            <div className="text-red-500 text-sm font-medium text-left">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 mt-6 text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Logging in...
                                </>
                            ) : (
                                'Secure Login'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-slate-400">
                        Don't have an account? <a href="#" className="text-primary font-bold hover:underline">Register</a>
                    </p>
                </div>
            </div>
        );
    }
}

export default LoginModal;
