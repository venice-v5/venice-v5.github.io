```python
from venice import Motor, Gearset, Direction
import venice.vasyncio

async def main():
    my_motor = Motor(
        1,
		Direction.FORWARD,
		Gearset.GREEN
	)
    my_motor.set_voltage(10.0)
    while True:
        await vasyncio.Sleep(5, venice.TimeUnit.MILLIS)
        print(f"Motor temperature: {my_motor.temperature()}")
vasyncio.run(main())
```
