import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactSelect, { StylesConfig, MultiValue } from "react-select";
import { FilterState, SelectOption, DURATION_OPTIONS } from "@/types/trips";
import {
  DollarSign,
  Clock,
  MapPin,
  Globe,
  MessageCircle,
  Zap,
} from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  filterOptions: {
    countries: string[];
    languages: string[];
    vibes: string[];
  };
  selectStyles: StylesConfig<SelectOption, true>;
  handlePriceMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLanguageChange: (selected: MultiValue<SelectOption>) => void;
  handleVibeChange: (selected: MultiValue<SelectOption>) => void;
}

export const FilterPanel = ({
  filters,
  updateFilter,
  filterOptions,
  handlePriceMinChange,
  handlePriceMaxChange,
  handleLanguageChange,
  handleVibeChange,
  selectStyles,
}: FilterPanelProps) => {
  const languageOptions = filterOptions.languages.map((l) => ({
    value: l,
    label: l,
  }));
  const vibeOptions = filterOptions.vibes.map((v) => ({ value: v, label: v }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Trip Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-white/30">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-white text-lg drop-shadow-md">
            Trip Details
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90 flex items-center gap-2 drop-shadow-sm">
              <DollarSign className="h-4 w-4 text-purple-300" />
              Price Range
            </Label>
            <div className="flex gap-3 items-center">
              <Input
                type="number"
                placeholder="Min"
                className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg py-3 px-4 font-medium focus:bg-white focus:border-purple-400 transition-all duration-300 text-gray-800"
                value={filters.priceRange[0] === 0 ? "" : filters.priceRange[0]}
                onChange={handlePriceMinChange}
              />
              <span className="font-medium text-white/80">to</span>
              <Input
                type="number"
                placeholder="Max"
                className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg py-3 px-4 font-medium focus:bg-white focus:border-purple-400 transition-all duration-300 text-gray-800"
                value={
                  filters.priceRange[1] === Infinity
                    ? ""
                    : filters.priceRange[1]
                }
                onChange={handlePriceMaxChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90 flex items-center gap-2 drop-shadow-sm">
              <Clock className="h-4 w-4 text-purple-300" />
              Duration
            </Label>
            <Select
              value={filters.daysFilter}
              onValueChange={(value) => updateFilter("daysFilter", value)}
            >
              <SelectTrigger className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg py-3 px-4 font-medium focus:bg-white focus:border-purple-400 transition-all duration-300 text-gray-800">
                <SelectValue placeholder="Choose trip length" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl">
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-medium hover:bg-purple-100 focus:bg-purple-100"
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
        <div className="flex items-center gap-3 pb-2 border-b border-white/30">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-xl shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-white text-lg drop-shadow-md">
            Location
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90 flex items-center gap-2 drop-shadow-sm">
              <Globe className="h-4 w-4 text-purple-300" />
              Country
            </Label>
            <Select
              value={filters.countryFilter}
              onValueChange={(value) => updateFilter("countryFilter", value)}
            >
              <SelectTrigger className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg py-3 px-4 font-medium focus:bg-white focus:border-purple-400 transition-all duration-300 text-gray-800">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl">
                <SelectItem
                  value="all"
                  className="font-medium hover:bg-purple-100 focus:bg-purple-100"
                >
                  All Countries
                </SelectItem>
                {filterOptions.countries.map((country) => (
                  <SelectItem
                    key={country}
                    value={country.toLowerCase()}
                    className="font-medium hover:bg-purple-100 focus:bg-purple-100"
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
        <div className="flex items-center gap-3 pb-2 border-b border-white/30">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-xl shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-white text-lg drop-shadow-md">
            Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90 flex items-center gap-2 drop-shadow-sm">
              <MessageCircle className="h-4 w-4 text-purple-300" />
              Languages
            </Label>
            <ReactSelect
              isMulti
              styles={selectStyles}
              placeholder="Select languages"
              options={languageOptions}
              value={filters.languageFilter.map((l) => ({
                value: l,
                label: l,
              }))}
              onChange={handleLanguageChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90 flex items-center gap-2 drop-shadow-sm">
              <Zap className="h-4 w-4 text-purple-300" />
              Vibes
            </Label>
            <ReactSelect
              isMulti
              styles={selectStyles}
              placeholder="Select vibes"
              options={vibeOptions}
              value={filters.vibeFilter.map((v) => ({
                value: v,
                label: v,
              }))}
              onChange={handleVibeChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
