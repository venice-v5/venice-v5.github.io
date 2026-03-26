```python
from venice import *

async def main():
    my_motor = Motor(
        1,
        Direction.FORWARD,
        Gearset.GREEN
    )
    my_motor.set_voltage(10.0)

    while True:
        await vasyncio.Sleep(10, TimeUnit.MILLIS)

vasyncio.run(main())
```
