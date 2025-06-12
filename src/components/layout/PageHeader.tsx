import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => (
  <div className="pb-5 border-b border-gray-200 sm:flex sm:justify-between sm:items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
  </div>
);

export default PageHeader;
