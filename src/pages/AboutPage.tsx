import { Info, Code, Database, Package } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-accent shrink-0" />
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary">About</h1>
      </div>

      <div className="bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6 border border-border-light dark:border-border-medium transition-colors">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary mb-3 sm:mb-4">About Navin</h2>
          <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary leading-relaxed">
            Navin is a developer checklist application designed to help maintain code quality
            and follow best practices throughout the development lifecycle. It provides
            a comprehensive checklist covering branch naming, API handling, code quality,
            performance, testing, and more.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-bg-primary dark:bg-pickled-bluewood/30 rounded-lg border border-border-light dark:border-border-medium">
              <h3 className="font-semibold text-sm sm:text-base text-text-primary dark:text-text-primary mb-2">Frontend</h3>
              <ul className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary space-y-1">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• React Router</li>
              </ul>
            </div>
            <div className="p-3 sm:p-4 bg-bg-primary dark:bg-pickled-bluewood/30 rounded-lg border border-border-light dark:border-border-medium">
              <h3 className="font-semibold text-sm sm:text-base text-text-primary dark:text-text-primary mb-2">Backend</h3>
              <ul className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary space-y-1">
                <li>• Tauri 2</li>
                <li>• Rust</li>
                <li>• SQLite</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            Features
          </h2>
          <ul className="space-y-2 text-sm sm:text-base text-text-secondary dark:text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-accent mt-1">✓</span>
              <span>Persistent checklist storage with SQLite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-accent mt-1">✓</span>
              <span>Progress tracking and export functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-accent mt-1">✓</span>
              <span>Admin mode for editing checklist items</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-accent mt-1">✓</span>
              <span>Code examples and best practices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-accent mt-1">✓</span>
              <span>Enterprise-ready architecture</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            Version
          </h2>
          <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary">Version 0.1.0</p>
        </section>
      </div>
    </div>
  );
};

