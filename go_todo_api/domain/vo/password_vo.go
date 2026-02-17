package value_object

import (
	"golang.org/x/crypto/bcrypt"
)

type RawPassword struct {
	value string
}

func (p RawPassword) ComparePassword(rawPassword RawPassword, param any) any {
	panic("unimplemented")
}

func FromStringRawPassword(v string) RawPassword {

	return RawPassword{value: v}
}

func (p RawPassword) Value() string {
	return p.value
}

func (p RawPassword) Hash() (HashedPassword, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(p.Value()), bcrypt.DefaultCost)
	if err != nil {
		return HashedPassword{}, err
	}
	return HashedPassword{value: string(hashed)}, nil
}

type HashedPassword struct {
	value string
}

func FromStringHashedPassword(v string) HashedPassword {
	return HashedPassword{value: v}
}

func (p HashedPassword) Value() string {
	return p.value
}

func (p HashedPassword) ComparePassword(rawPassword RawPassword) error {
	return bcrypt.CompareHashAndPassword([]byte(p.Value()), []byte(rawPassword.Value()))
}
