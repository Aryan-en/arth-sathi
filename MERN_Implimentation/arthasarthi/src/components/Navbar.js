import { Component } from 'react';

class Navbar extends Component {
    render() { 
        return (
            <nav className="glass-nav fixed w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={this.props.onShowLanding}>
                            <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition">
                                <i className="fas fa-seedling text-2xl text-primary"></i>
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-slate-800">Artha<span className="text-primary">Sarthi</span></span>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-6">
                            <button onClick={this.props.onShowLanding} className="text-slate-600 hover:text-primary font-medium transition">Home</button>
                            <button onClick={() => this.props.onLaunchApp('translator')} className="text-slate-600 hover:text-primary font-medium transition">Translator</button>
                            <button onClick={() => this.props.onLaunchApp('chatbot')} className="text-slate-600 hover:text-primary font-medium transition">Sahayak Bot</button>
                            <button onClick={() => this.props.onLaunchApp('blog')} className="text-slate-600 hover:text-primary font-medium transition">Blog</button>
                            <button onClick={() => this.props.onLaunchApp('ledger')} className="text-slate-600 hover:text-primary font-medium transition flex items-center gap-1"><i className="fas fa-calculator text-xs"></i> Ledger</button>
                            <button onClick={this.props.onToggleModal} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300">
                                Login
                            </button>
                        </div>

                        <div className="md:hidden">
                            <button className="text-slate-600 hover:text-primary text-2xl"><i className="fas fa-bars"></i></button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
 
export default Navbar;