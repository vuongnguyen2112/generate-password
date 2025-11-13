import {useEffect, useState} from 'react';
import {Check, Copy, RefreshCw} from 'lucide-react';

interface Options {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
}

interface Strength {
    text: string;
    color: string;
    width: string;
}

function App() {
    const [password, setPassword] = useState<string>('');
    const [length, setLength] = useState<number>(15);
    const [copied, setCopied] = useState<boolean>(false);
    const [options, setOptions] = useState<Options>({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });

    const generatePassword = () => {
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lowercase = 'abcdefghijkmnopqrstuvwxyz';
        const numbers = '23456789';
        const symbols = '!@#$%^&*-_=+';

        let chars = '';
        let newPassword = '';

        if (options.uppercase) chars += uppercase;
        if (options.lowercase) chars += lowercase;
        if (options.numbers) chars += numbers;
        if (options.symbols) chars += symbols;

        if (chars === '') {
            chars = lowercase;
        }

        // Đảm bảo password có ít nhất 1 ký tự từ mỗi loại được chọn
        if (options.uppercase) newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
        if (options.lowercase) newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
        if (options.numbers) newPassword += numbers[Math.floor(Math.random() * numbers.length)];
        if (options.symbols) newPassword += symbols[Math.floor(Math.random() * symbols.length)];

        // Tạo phần còn lại của password
        for (let i = newPassword.length; i < length; i++) {
            newPassword += chars[Math.floor(Math.random() * chars.length)];
        }

        // Trộn ngẫu nhiên các ký tự
        newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

        setPassword(newPassword);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (password) {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getStrength = (): Strength => {
        if (!password) return {text: '', color: '', width: '0%'};

        let strength = 0;
        if (password.length >= 12) strength += 25;
        if (password.length >= 15) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 12;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 13;

        if (strength < 40) return {text: 'Weak', color: 'bg-red-500', width: '25%'};
        if (strength < 70) return {text: 'Average', color: 'bg-yellow-500', width: '50%'};
        if (strength < 90) return {text: 'Strong', color: 'bg-blue-500', width: '75%'};
        return {text: 'Titan', color: 'bg-green-500', width: '100%'};
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        generatePassword();
    }, [length, options]);

    const strength = getStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Generate Password</h1>
                    <p className="text-gray-600">Google's Standard - Secure & Strong</p>
                </div>

                {/* Password Display */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={password}
                            readOnly
                            className="w-full px-4 py-4 pr-24 text-lg font-mono bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Nhấn tạo mật khẩu..."
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Sao chép"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-600"/>
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-600"/>
                                )}
                            </button>
                            <button
                                onClick={generatePassword}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Tạo mới"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-600"/>
                            </button>
                        </div>
                    </div>

                    {/* Strength Indicator */}
                    {password && (
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Security Strength:</span>
                                <span className={`text-sm font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                  {strength.text}
                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${strength.color} h-2 rounded-full transition-all duration-300`}
                                    style={{width: strength.width}}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Length Slider */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Length</label>
                        <span className="text-sm font-bold text-blue-600">{length} character(s)</span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                    <label
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700 font-medium">Uppercase (A-Z)</span>
                        <input
                            type="checkbox"
                            checked={options.uppercase}
                            onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700 font-medium">Lowercase (a-z)</span>
                        <input
                            type="checkbox"
                            checked={options.lowercase}
                            onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700 font-medium">Number (0-9)</span>
                        <input
                            type="checkbox"
                            checked={options.numbers}
                            onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700 font-medium">Special (!@#$%)</span>
                        <input
                            type="checkbox"
                            checked={options.symbols}
                            onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generatePassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                    Create New Password
                </button>

                {/* Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        💡 <strong>Tips:</strong> Strong passwords should contain at least 15 characters with various
                        character types combined.
                        Avoid using same password for multiple accounts
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;