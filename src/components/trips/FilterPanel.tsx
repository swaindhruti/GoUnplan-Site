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
    <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Trip Details */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b-3 border-black pb-2">
          <div className="bg-blue-400 p-1.5 rounded-lg border-2 border-black">
            <Clock className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-black uppercase tracking-wider">
            Trip Details
          </h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="h-4 w-4" strokeWidth={2.5} />
            Price Range
          </Label>
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              placeholder="Min"
              className="bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] py-5 px-4 font-bold"
              value={filters.priceRange[0] === 0 ? "" : filters.priceRange[0]}
              onChange={handlePriceMinChange}
            />
            <span className="font-black text-lg">to</span>
            <Input
              type="number"
              placeholder="Max"
              className="bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] py-5 px-4 font-bold"
              value={
                filters.priceRange[1] === Infinity ? "" : filters.priceRange[1]
              }
              onChange={handlePriceMaxChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-4 w-4" strokeWidth={2.5} />
            Duration
          </Label>
          <div className="relative">
            <Select
              value={filters.daysFilter}
              onValueChange={(value) => updateFilter("daysFilter", value)}
            >
              <SelectTrigger className="bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] py-5 px-4 font-bold">
                <SelectValue placeholder="Choose trip length" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black bg-white">
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-bold hover:bg-green-300"
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
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b-3 border-black pb-2">
          <div className="bg-pink-500 p-1.5 rounded-lg border-2 border-black">
            <MapPin className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-black uppercase tracking-wider">
            Location
          </h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-1">
            <Globe className="h-4 w-4" strokeWidth={2.5} />
            Country
          </Label>
          <div className="relative">
            <Select
              value={filters.countryFilter}
              onValueChange={(value) => updateFilter("countryFilter", value)}
            >
              <SelectTrigger className="bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] py-5 px-4 font-bold">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black bg-white">
                <SelectItem
                  value="all"
                  className="font-bold hover:bg-green-300"
                >
                  All Countries
                </SelectItem>
                {filterOptions.countries.map((country) => (
                  <SelectItem
                    key={country}
                    value={country.toLowerCase()}
                    className="font-bold hover:bg-green-300"
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
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b-3 border-black pb-2">
          <div className="bg-yellow-300 p-1.5 rounded-lg border-2 border-black">
            <Zap className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-black uppercase tracking-wider">
            Preferences
          </h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-1">
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            Languages
          </Label>
          <ReactSelect
            isMulti
            styles={selectStyles} // Use the styles passed from the parent
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
          <Label className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-1">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
            Vibes
          </Label>
          <ReactSelect
            isMulti
            styles={selectStyles} // Use the styles passed from the parent
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
  );
};
