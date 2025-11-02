'use client';
import { useState, useMemo } from 'react';
import { Trip } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDateRange } from './common/utils';
import Image from 'next/image';
import { TripDetailsModal } from './TripDetailsModal';
import {
  Plus,
  Map,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Edit,
  Eye,
  Activity,
} from 'lucide-react';

type TripSectionProps = {
  trips: Trip[];
  loading: boolean;
  error: string | null;
};

export const TripSection = ({ trips, loading, error }: TripSectionProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openTripModal = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const closeTripModal = () => {
    setSelectedTrip(null);
    setIsModalOpen(false);
  };

  const filteredTrips = useMemo(() => {
    if (statusFilter === 'all') return trips;
    return trips.filter(trip => trip.status.toLowerCase() === statusFilter.toLowerCase());
  }, [trips, statusFilter]);

  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const activeTrips = trips.filter(t => t.status.toLowerCase() === 'active').length;
    const inactiveTrips = trips.filter(t => t.status.toLowerCase() === 'inactive').length;
    const draftTrips = trips.filter(t => t.status.toLowerCase() === 'draft').length;
    const totalRevenue = trips.reduce((sum, trip) => sum + trip.price, 0);

    return { totalTrips, activeTrips, inactiveTrips, draftTrips, totalRevenue };
  }, [trips]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Activity className="h-4 w-4" />;
      case 'inactive':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900 font-bricolage">Travel Experiences</h2>
          <p className="text-gray-600 font-instrument">
            Create and manage your curated travel experiences
          </p>
        </div>
        <Link
          href="/dashboard/host/create-new-task"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors font-instrument"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Trip
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 font-instrument">Total Experiences</p>
              <p className="text-2xl font-bold text-gray-900 font-bricolage">{stats.totalTrips}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-500 font-instrument">All your created trips</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 font-instrument">Active</p>
              <p className="text-2xl font-bold text-gray-900 font-bricolage">{stats.activeTrips}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-500 font-instrument">Currently available</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 font-instrument">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 font-bricolage">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-500 font-instrument">Combined trip value</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 font-instrument">Draft</p>
              <p className="text-2xl font-bold text-gray-900 font-bricolage">{stats.draftTrips}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-500 font-instrument">In development</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                All Experiences
              </h3>
              <p className="text-sm text-gray-600 font-instrument">
                Manage your travel experiences
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-instrument ${
                  statusFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                All
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-xs">
                  {stats.totalTrips}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-instrument ${
                  statusFilter === 'active'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Active
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-xs">
                  {stats.activeTrips}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-instrument ${
                  statusFilter === 'inactive'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Inactive
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-xs">
                  {stats.inactiveTrips}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-instrument ${
                  statusFilter === 'draft'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Draft
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-xs">
                  {stats.draftTrips}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <span className="text-xl font-semibold text-slate-900">
                Loading your experiences...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <p className="text-xl font-semibold text-slate-900">{error}</p>
              </div>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-purple-600" />
                </div>
                <p className="text-xl font-semibold text-slate-900">
                  {trips.length === 0
                    ? 'No experiences found. Start by creating your first one!'
                    : `No ${statusFilter} experiences found.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map(trip => (
                <div
                  key={trip.travelPlanId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Trip Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full lg:w-40 h-40">
                        <Image
                          src={trip.tripImage || 'https://avatar.iran.liara.run/public'}
                          alt={trip.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                              trip.status
                            )}`}
                          >
                            {getStatusIcon(trip.status)}
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="flex-grow space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {trip.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {trip.destination && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-purple-600" />
                                {trip.destination}
                              </span>
                            )}
                            {trip.city && trip.state && (
                              <span className="flex items-center gap-1">
                                <Map className="h-4 w-4 text-purple-600" />
                                {trip.city}, {trip.state}
                              </span>
                            )}
                            {trip.startDate && trip.endDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-purple-600" />
                                {formatDateRange(trip.startDate, trip.endDate)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-purple-600" />
                              {trip.noOfDays} days
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-purple-600" />
                              Max {trip.maxParticipants} participants
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(trip.price)}
                            </p>
                            <p className="text-sm text-gray-500">per person</p>
                          </div>

                          {/* Trip Stats */}
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-gray-900">{trip.reviewCount || 0}</p>
                              <p className="text-gray-500">Reviews</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-gray-900">
                                {trip.averageRating ? trip.averageRating.toFixed(1) : '0.0'}
                              </p>
                              <p className="text-gray-500">Rating</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        {trip.status.toLowerCase() === 'draft' && (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/host/create-new-task?tripId=${trip.travelPlanId}&complete=true`
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            <Activity className="h-4 w-4" />
                            Complete Trip
                          </button>
                        )}
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/host/create-new-task?tripId=${trip.travelPlanId}`
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Trip
                        </button>
                        <button
                          onClick={() => openTripModal(trip)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                      </div>

                      {/* Trip Filters/Languages */}
                      {((trip.filters && trip.filters.length > 0) ||
                        (trip.languages && trip.languages.length > 0)) && (
                        <div className="flex flex-wrap gap-2 pt-3">
                          {trip.filters?.map((filter: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                            >
                              {filter}
                            </span>
                          ))}
                          {trip.languages?.map((language: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Modal */}
      <TripDetailsModal trip={selectedTrip} isOpen={isModalOpen} onClose={closeTripModal} />
    </div>
  );
};
