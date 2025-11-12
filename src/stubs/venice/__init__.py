"""
Venice is an open-source Micropython runtime for VEX V5 robots.

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
vasyncio.run(main())
```
"""
from __future__ import annotations
# from vasyncio import *
from typing import overload, Literal, ClassVar

class RotationUnit:
    """Represents a unit of rotation."""

    RADIANS: ClassVar["RotationUnit"]
    """The rotation unit for radians."""

    DEGREES: ClassVar["RotationUnit"]
    """The rotation unit for degrees."""

    TURNS: ClassVar["RotationUnit"]
    """The rotation unit for turns."""

class TimeUnit:
    """Represents a unit of time."""

    MILLIS: ClassVar["TimeUnit"]
    """The time unit for milliseconds."""

    SECOND: ClassVar["TimeUnit"]
    """The time unit for seconds."""


class BrakeMode:
    """Enumeration for motor brake modes."""

    BRAKE: ClassVar["BrakeMode"]
    """Brake mode."""

    COAST: ClassVar["BrakeMode"]
    """Coast mode."""

    HOLD: ClassVar["BrakeMode"]
    """Hold mode."""

class Direction:
    """Enumeration for motor direction."""

    FORWARD: ClassVar["Direction"]
    """Forward direction."""

    REVERSE: ClassVar["Direction"]
    """Reverse direction."""

class Gearset:
    """Enumeration for motor gearsets."""

    RED: ClassVar["Gearset"]
    """Red gearset."""

    GREEN: ClassVar["Gearset"]
    """Green gearset."""

    BLUE: ClassVar["Gearset"]
    """Blue gearset."""

class MotorType:
    """Enumeration for motor types."""

    V5: ClassVar["MotorType"]
    """V5 motor type."""

    EXP: ClassVar["MotorType"]
    """EXP motor type."""

class Motor:
    """A motor device for controlling VEX motors."""

    WRITE_INTERVAL_MS: int = 5
    """Write interval in milliseconds."""

    EXP_MAX_VOLTAGE: float = 8.0
    """Maximum voltage for EXP motors."""

    V5_MAX_VOLTAGE: float = 12.0
    """Maximum voltage for V5 motors."""

    def __init__(self, port: int, direction: Direction, gearset_or_exp: Gearset | Literal[True]) -> None:
        """Initialize a motor.

        Args:
            port: The port number (1-21).
            direction: The motor direction.
            gearset_or_exp: The gearset for the motor, if it is a Smart Motor, or True for EXP motors.
        """
        ...

    def set_voltage(self, volts: float) -> None:
        """Set the motor voltage.

        Args:
            volts: Voltage in volts.
        """
        ...

    def set_velocity(self, rpm: int) -> None:
        """Set the motor velocity.

        Args:
            rpm: Velocity in RPM.
        """
        ...

    def brake(self, mode: BrakeMode) -> None:
        """Set the motor brake mode.

        Args:
            mode: The brake mode.
        """
        ...

    def set_gearset(self, gearset: Gearset) -> None:
        """Set the motor gearset.

        Args:
            gearset: The gearset.
        """
        ...

    def gearset(self) -> Gearset:
        """Get the motor gearset.

        Returns:
            The current gearset.
        """
        ...

    def set_position_target(self, position: float, unit: RotationUnit, velocity: float) -> None:
        """Set the position target with velocity.

        Args:
            position: Target position.
            unit: Unit of the position.
            velocity: Velocity for the movement.
        """
        ...

    def is_exp(self) -> bool:
        """Check if the motor is an EXP motor.

        Returns:
            True if EXP, False otherwise.
        """
        ...

    def is_v5(self) -> bool:
        """Check if the motor is a V5 motor.

        Returns:
            True if V5, False otherwise.
        """
        ...

    def max_voltage(self) -> float:
        """Get the maximum voltage for the motor.

        Returns:
            Maximum voltage in volts.
        """
        ...

    def velocity(self) -> float:
        """Get the current velocity.

        Returns:
            Velocity in RPM.
        """
        ...

    def power(self) -> float:
        """Get the current power.

        Returns:
            Power in watts.
        """
        ...

    def torque(self) -> float:
        """Get the current torque.

        Returns:
            Torque in Nm.
        """
        ...

    def voltage(self) -> float:
        """Get the current voltage.

        Returns:
            Voltage in volts.
        """
        ...

    def raw_position(self) -> int:
        """Get the raw position.

        Returns:
            Raw position as integer.
        """
        ...

    def current(self) -> float:
        """Get the current draw.

        Returns:
            Current in amps.
        """
        ...

    def efficiency(self) -> float:
        """Get the motor efficiency.

        Returns:
            Efficiency as a percentage.
        """
        ...

    def current_limit(self) -> float:
        """Get the current limit.

        Returns:
            Current limit in amps.
        """
        ...

    def voltage_limit(self) -> float:
        """Get the voltage limit.

        Returns:
            Voltage limit in volts.
        """
        ...

    def temperature(self) -> float:
        """Get the motor temperature.

        Returns:
            Temperature in Celsius.
        """
        ...

    def set_profiled_velocity(self, velocity: int) -> None:
        """Set the profiled velocity.

        Args:
            velocity: Velocity in RPM.
        """
        ...

    def reset_position(self) -> None:
        """Reset the motor position."""
        ...

    def set_current_limit(self, limit: float) -> None:
        """Set the current limit.

        Args:
            limit: Current limit in amps.
        """
        ...

    def set_voltage_limit(self, limit: float) -> None:
        """Set the voltage limit.

        Args:
            limit: Voltage limit in volts.
        """
        ...

    def is_over_temperature(self) -> bool:
        """Check if the motor is over temperature.

        Returns:
            True if over temperature, False otherwise.
        """
        ...

    def is_over_current(self) -> bool:
        """Check if the motor is over current.

        Returns:
            True if over current, False otherwise.
        """
        ...

    def is_driver_fault(self) -> bool:
        """Check if there is a driver fault.

        Returns:
            True if fault, False otherwise.
        """
        ...

    def is_driver_over_current(self) -> bool:
        """Check if the driver is over current.

        Returns:
            True if over current, False otherwise.
        """
        ...

    def status(self) -> int:
        """Get the motor status.

        Returns:
            Status as integer bitfield.
        """
        ...

    def faults(self) -> int:
        """Get the motor faults.

        Returns:
            Faults as integer bitfield.
        """
        ...

    def motor_type(self) -> MotorType:
        """Get the motor type.

        Returns:
            The motor type.
        """
        ...

    def position(self, unit: RotationUnit) -> float:
        """Get the current position.

        Args:
            unit: Unit for the position.

        Returns:
            Position in the specified unit.
        """
        ...

    def set_position(self, position: float, unit: RotationUnit) -> None:
        """Set the motor position.

        Args:
            position: Position value.
            unit: Unit of the position.
        """
        ...

    def set_direction(self, direction: Direction) -> None:
        """Set the motor direction.

        Args:
            direction: The direction.
        """
        ...

    def direction(self) -> Direction:
        """Get the motor direction.

        Returns:
            The current direction.
        """
        ...
