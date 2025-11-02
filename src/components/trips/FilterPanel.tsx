import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReactSelect, { StylesConfig, MultiValue, CSSObjectWithLabel } from 'react-select';
import { FilterState, SelectOption, DURATION_OPTIONS } from '@/types/trips';
import { DollarSign, Clock, MapPin, Globe, MessageCircle, Zap, Filter } from 'lucide-react';
import { useState } from 'react';

const INITIAL_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Mandarin',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Russian',
];

const INITIAL_VIBES = [
  'Adventure',
  'Relaxation',
  'Culture',
  'Nature',
  'Nightlife',
  'Foodie',
  'Luxury',
  'Budget',
  'Wellness',
  'Family',
];

const INITIAL_TRAVELLERS = [
  'Solo',
  'Couple',
  'With Baby',
  'Friends',
  'Family',
  'Group',
  'Pet Friendly',
  'Senior',
  'Business',
  'Backpackers',
];

interface FilterPanelProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  filterOptions: {
    countries: string[];
    languages: string[];
    vibes: string[];
    travellers: string[];
  };
  selectStyles: StylesConfig<SelectOption, true>;
  handlePriceMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLanguageChange: (selected: MultiValue<SelectOption>) => void;
  handleVibeChange: (selected: MultiValue<SelectOption>) => void;
  handleTravellerChange: (selected: MultiValue<SelectOption>) => void; // <-- Add this
}

export const FilterPanel = ({
  filters,
  updateFilter,
  filterOptions,
  handlePriceMinChange,
  handlePriceMaxChange,
  handleLanguageChange,
  handleVibeChange,
  handleTravellerChange,
  selectStyles,
}: FilterPanelProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const languageOptions = INITIAL_LANGUAGES.map(l => ({
    value: l,
    label: l,
  }));

  const vibeOptions = INITIAL_VIBES.map(v => ({
    value: v,
    label: v,
  }));

  const travellerOptions = INITIAL_TRAVELLERS.map(t => ({
    value: t,
    label: t,
  }));

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const menuPortalStyles = {
    menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="w-full">
      {/* Mobile Accordion View */}
      <div className="block lg:hidden space-y-4">
        {/* Trip Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('trip-details')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Trip Details</span>
            </div>
            <Filter
              className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                activeSection === 'trip-details' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              activeSection === 'trip-details' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  Price Range
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900"
                    value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
                    onChange={handlePriceMinChange}
                  />
                  <span className="font-medium text-gray-500 text-sm">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900"
                    value={filters.priceRange[1] === Infinity ? '' : filters.priceRange[1]}
                    onChange={handlePriceMaxChange}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Duration
                </Label>
                <Select
                  value={filters.daysFilter}
                  onValueChange={value => updateFilter('daysFilter', value)}
                >
                  <SelectTrigger className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900">
                    <SelectValue placeholder="Choose trip length" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {DURATION_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="font-medium hover:bg-purple-50 focus:bg-purple-50 text-gray-900"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('location')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Location</span>
            </div>
            <Filter
              className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                activeSection === 'location' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              activeSection === 'location' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  Country
                </Label>
                <Select
                  value={filters.countryFilter}
                  onValueChange={value => updateFilter('countryFilter', value)}
                >
                  <SelectTrigger className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <SelectItem
                      value="all"
                      className="font-medium hover:bg-purple-50 focus:bg-purple-50 text-gray-900"
                    >
                      All Countries
                    </SelectItem>
                    {filterOptions.countries.map(country => (
                      <SelectItem
                        key={country}
                        value={country.toLowerCase()}
                        className="font-medium hover:bg-purple-50 focus:bg-purple-50 text-gray-900"
                      >
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Preferences</span>
            </div>
            <Filter
              className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                activeSection === 'preferences' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              activeSection === 'preferences' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Languages */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  Languages
                </Label>
                <ReactSelect
                  isMulti
                  instanceId="language-select-mobile"
                  styles={{ ...selectStyles, ...menuPortalStyles }}
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                  placeholder="Select languages"
                  options={languageOptions}
                  value={filters.languageFilter.map(l => ({
                    value: l,
                    label: l,
                  }))}
                  onChange={handleLanguageChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPlacement="auto"
                />
              </div>

              {/* Vibes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Vibes
                </Label>
                <ReactSelect
                  isMulti
                  instanceId="vibe-select-mobile"
                  styles={{ ...selectStyles, ...menuPortalStyles }}
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                  placeholder="Select vibes"
                  options={vibeOptions}
                  value={filters.vibeFilter.map(v => ({
                    value: v,
                    label: v,
                  }))}
                  onChange={handleVibeChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPlacement="auto"
                />
              </div>

              {/* Travellers */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  Travellers
                </Label>
                <ReactSelect
                  isMulti
                  instanceId="traveller-select-mobile"
                  styles={{ ...selectStyles, ...menuPortalStyles }}
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                  placeholder="Select travellers"
                  options={travellerOptions}
                  value={
                    filters.travellerFilter?.map((t: string) => ({
                      value: t,
                      label: t,
                    })) || []
                  }
                  onChange={handleTravellerChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPlacement="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {/* Trip Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Trip Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                Price Range
              </Label>
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900"
                  value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
                  onChange={handlePriceMinChange}
                />
                <span className="font-medium text-gray-500 text-sm">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900"
                  value={filters.priceRange[1] === Infinity ? '' : filters.priceRange[1]}
                  onChange={handlePriceMaxChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Duration
              </Label>
              <Select
                value={filters.daysFilter}
                onValueChange={value => updateFilter('daysFilter', value)}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900">
                  <SelectValue placeholder="Choose trip length" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  {DURATION_OPTIONS.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="font-medium hover:bg-purple-50 focus:bg-purple-50 text-gray-900"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="bg-purple-600 p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Location</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                Country
              </Label>
              <Select
                value={filters.countryFilter}
                onValueChange={value => updateFilter('countryFilter', value)}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg py-2 px-3 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-900">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  <SelectItem
                    value="all"
                    className="font-medium hover:bg-purple-50 focus:bg-purple-50 text-gray-900"
                  >
                    All Countries
                  </SelectItem>
                  {filterOptions.countries.map(country => (
                    <SelectItem
                      key={country}
                      value={country.toLowerCase()}
                      className="font-medium hover:bg-purple-50 focus:bg-purple-50 text-gray-900"
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Preferences</h3>
          </div>

          <div className="space-y-4">
            {/* Languages */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-purple-600" />
                Languages
              </Label>
              <ReactSelect
                isMulti
                instanceId="language-select-desktop"
                styles={{ ...selectStyles, ...menuPortalStyles }}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                placeholder="Select languages"
                options={languageOptions}
                value={filters.languageFilter.map(l => ({
                  value: l,
                  label: l,
                }))}
                onChange={handleLanguageChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Vibes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                Vibes
              </Label>
              <ReactSelect
                isMulti
                instanceId="vibe-select-desktop"
                styles={{ ...selectStyles, ...menuPortalStyles }}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                placeholder="Select vibes"
                options={vibeOptions}
                value={filters.vibeFilter.map(v => ({
                  value: v,
                  label: v,
                }))}
                onChange={handleVibeChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Travellers */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                Travellers
              </Label>
              <ReactSelect
                isMulti
                instanceId="traveller-select-desktop"
                styles={{ ...selectStyles, ...menuPortalStyles }}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                placeholder="Select travellers"
                options={travellerOptions}
                value={
                  filters.travellerFilter?.map((t: string) => ({
                    value: t,
                    label: t,
                  })) || []
                }
                onChange={handleTravellerChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
