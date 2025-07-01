import { Filter, ChevronUp, ChevronDown, X } from "lucide-react";

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
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-3">
        <button
          className={`
            relative px-4 py-3 font-extrabold text-sm uppercase tracking-wider
            border-3 border-black rounded-lg
            flex items-center gap-2
            transition-all duration-150
            ${
              showFilters
                ? "bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
            }
          `}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" strokeWidth={2.5} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <div className="bg-pink-500 border-2 border-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
              {activeFiltersCount}
            </div>
          )}
          {showFilters ? (
            <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            className="
              px-4 py-3 font-bold text-sm uppercase
              border-3 border-black rounded-lg
              bg-red-400 text-black
              hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1
              transition-all duration-150
              flex items-center gap-2
            "
            onClick={clearAllFilters}
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
            Clear all
          </button>
        )}
      </div>

      <div className="bg-yellow-300 border-3 border-black px-5 py-3 rounded-lg font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-lg font-black mr-1">{filteredTripsCount}</span>
        <span className="uppercase tracking-wider">
          {filteredTripsCount === 1 ? "trip" : "trips"} found
        </span>
      </div>
    </div>
  );
};
