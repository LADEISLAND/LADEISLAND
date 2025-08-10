import React, { useState } from 'react';
import { X, Crown, MapPin } from 'lucide-react';
import { Country, CountryCreateForm } from '../types';
import { countryAPI } from '../services/api';

interface CountryCreateModalProps {
  onClose: () => void;
  onCountryCreated: (country: Country) => void;
}

const CountryCreateModal: React.FC<CountryCreateModalProps> = ({
  onClose,
  onCountryCreated,
}) => {
  const [formData, setFormData] = useState<CountryCreateForm>({
    name: '',
    leader_title: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const leaderTitles = [
    'President',
    'Emperor',
    'King',
    'Queen',
    'Prime Minister',
    'Chancellor',
    'Scientist',
    'General',
    'Admiral',
    'Philosopher',
    'Merchant',
    'Explorer',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leader_title.trim()) {
      setError('Please select a leader title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const country = await countryAPI.createCountry(formData);
      onCountryCreated(country);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create country. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-cosmic-100 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-cosmic-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create Your Country</h2>
              <p className="text-sm text-gray-500">Begin your journey as a leader</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="leader_title" className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Role
            </label>
            <select
              id="leader_title"
              name="leader_title"
              value={formData.leader_title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
              required
            >
              <option value="">Select a leader title...</option>
              {leaderTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Country Name (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Leave empty for AI-generated name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              If you don't provide a name, we'll generate a creative one for you
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Preview */}
          {formData.leader_title && (
            <div className="bg-cosmic-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-cosmic-900 mb-2">Preview</h3>
              <p className="text-sm text-cosmic-700">
                You will become a <span className="font-semibold">{formData.leader_title}</span>
                {formData.name && (
                  <>
                    {' '}of <span className="font-semibold">{formData.name}</span>
                  </>
                )}
                {!formData.name && (
                  <>
                    {' '}of a <span className="font-semibold">new nation</span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.leader_title}
              className="flex-1 px-4 py-2 bg-cosmic-600 text-white rounded-lg hover:bg-cosmic-700 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Country'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountryCreateModal;