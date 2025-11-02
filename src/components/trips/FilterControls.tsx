import { Filter, ChevronUp, ChevronDown, X } from 'lucide-react';

interface FilterControlsProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  filteredTripsCount: number;
  clearAllFilters: () => void;
}

export const FilterControls = ({
  showFilters,
  setShowFilters,
  activeFiltersCount,
  filteredTripsCount,
  clearAllFilters,
}: FilterControlsProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          className={`
            relative px-6 py-4 font-semibold text-sm tracking-wide
            rounded-2xl flex items-center gap-3 transition-all duration-300
            ${
              showFilters
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white hover:shadow-lg hover:scale-105'
            }
          `}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <div className="bg-white/90 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {activeFiltersCount}
            </div>
          )}
          {showFilters ? (
            <ChevronUp className="h-5 w-5 transition-transform duration-300" />
          ) : (
            <ChevronDown className="h-5 w-5 transition-transform duration-300" />
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            className="
              px-6 py-4 font-semibold text-sm tracking-wide
              rounded-2xl bg-red-500/90 backdrop-blur-sm border border-red-400/50 text-white
              hover:bg-red-500 hover:shadow-lg hover:scale-105
              transition-all duration-300 flex items-center gap-3
            "
            onClick={clearAllFilters}
          >
            <X className="h-5 w-5" />
            Clear all
          </button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-white/40 px-6 py-4 rounded-2xl font-semibold text-gray-700 shadow-lg">
        <span className="text-2xl font-bold text-purple-600 mr-2">{filteredTripsCount}</span>
        <span className="tracking-wide">{filteredTripsCount === 1 ? 'trip' : 'trips'} found</span>
      </div>
    </div>
  );
};
