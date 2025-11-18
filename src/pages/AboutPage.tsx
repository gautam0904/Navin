import { Info, Code, Database, Package } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Info className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About Navin</h2>
          <p className="text-gray-700 leading-relaxed">
            Navin is a developer checklist application designed to help maintain code quality
            and follow best practices throughout the development lifecycle. It provides
            a comprehensive checklist covering branch naming, API handling, code quality,
            performance, testing, and more.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• React Router</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tauri 2</li>
                <li>• Rust</li>
                <li>• SQLite</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Features
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Persistent checklist storage with SQLite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Progress tracking and export functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Admin mode for editing checklist items</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Code examples and best practices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Enterprise-ready architecture</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Version
          </h2>
          <p className="text-gray-700">Version 0.1.0</p>
        </section>
      </div>
    </div>
  );
};

