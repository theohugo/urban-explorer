import * as Calendar from 'expo-calendar';

/**
 * Service pour gérer l'ajout d'événements au calendrier du téléphone
 */

export interface CalendarEventInput {
  title: string;
  startDate: Date;
  location: string;
  notes?: string;
}

/**
 * Demande les permissions d'accès au calendrier
 */
export async function requestCalendarPermission(): Promise<boolean> {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Erreur lors de la demande de permission calendrier:', error);
    return false;
  }
}

/**
 * Récupère les calendriers disponibles sur l'appareil
 */
export async function getAvailableCalendars(): Promise<Calendar.Calendar[]> {
  try {
    const calendars = await Calendar.getCalendarsAsync();
    return calendars.filter((cal) => cal.isPrimary || cal.title === 'Calendar');
  } catch (error) {
    console.warn('Erreur lors de la récupération des calendriers:', error);
    return [];
  }
}

/**
 * Ajoute un événement au calendrier principal
 */
export async function addEventToCalendar(eventData: CalendarEventInput): Promise<string | null> {
  try {
    // Demander les permissions
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      console.warn('Permission calendrier refusée');
      return null;
    }

    // Récupérer le calendrier principal
    const calendars = await getAvailableCalendars();
    if (calendars.length === 0) {
      console.warn('Aucun calendrier disponible');
      return null;
    }

    const primaryCalendar = calendars[0];

    // Créer l'événement
    const eventId = await Calendar.createEventAsync(primaryCalendar.id, {
      title: eventData.title,
      startDate: eventData.startDate,
      endDate: new Date(eventData.startDate.getTime() + 2 * 60 * 60 * 1000), // 2h après le début
      location: eventData.location,
      notes: eventData.notes,
      timeZone: 'Europe/Paris',
    });

    console.log(`✅ Événement ajouté au calendrier: ${eventId}`);
    return eventId;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement au calendrier:', error);
    return null;
  }
}

/**
 * Ajoute un événement pour une visite planifiée avec l'heure spécifiée
 */
export async function addVisitToCalendar(
  placeName: string,
  placeAddress: string,
  dateString: string,
  timeString: string = '10:00' // Format: "14:30"
): Promise<string | null> {
  // Convertir la date string (YYYY-MM-DD) et l'heure (HH:MM) en Date
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  const startDate = new Date(year, month - 1, day, hours, minutes);

  return addEventToCalendar({
    title: `📍 ${placeName}`,
    startDate,
    location: placeAddress,
    notes: `Visite planifiée de ${placeName} à ${timeString}`,
  });
}

/**
 * Supprime un événement du calendrier du téléphone
 */
export async function deleteEventFromCalendar(eventId: string): Promise<boolean> {
  try {
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      console.warn('Permission calendrier refusée');
      return false;
    }

    await Calendar.deleteEventAsync(eventId);
    console.log(`✅ Événement supprimé du calendrier: ${eventId}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement du calendrier:', error);
    return false;
  }
}
