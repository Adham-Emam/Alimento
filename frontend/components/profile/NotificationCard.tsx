import { Switch } from '../ui/switch'

const notificationItems = [
  {
    title: 'Meal Reminders',
    description: "Get reminded when it's time to eat",
    checked: true,
  },
  {
    title: 'Weekly Report',
    description: 'Receive a summary of your nutrition each week',
    checked: true,
  },
  {
    title: 'Health Tips',
    description: 'Get personalized nutrition tips',
    checked: false,
  },
]

const NotificationCard = () => {
  return (
    <>
      <h2 className="mb-8 text-2xl font-bold">Notification</h2>

      <div className="space-y-4">
        {notificationItems.map((item, index) => (
          <div
            key={index}
            className="bg-foreground/10 dark:bg-accent-foreground/20 flex items-center justify-between gap-4 rounded-2xl py-4 px-6"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Switch checked={item.checked} className="text" />
          </div>
        ))}
      </div>
    </>
  )
}

export default NotificationCard
